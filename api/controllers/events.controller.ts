import { createClient } from "@sanity/client";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";
import { sendMail } from "../utils/mail";
import ErrorHandler from "../utils/ErrorHandler";
import { convertToISO } from "./tasks.controller";
import cron from 'node-cron';

const sanity = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-01-01',
    token: process.env.SANITY_API_TOKEN,
});


// get all events

export const getEvents = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = `*[_type == "event"]`;

        // check user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler('User not found', 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const events = await sanity.fetch(query);

        return res.status(200).json({ success: true, data: events });
    } catch (error:any) {
        next(new ErrorHandler(error.message, 500));
    }
});


// get one event
export const getEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const query = `*[_type == "event" && _id == $id][0]`;

        // check user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler('User not found', 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }


        const event = await sanity.fetch(query, { id });

        if (!event) {
            return next(new ErrorHandler('Event not found', 404));
        }

        return res.status(200).json({ success: true, data: event });
    } catch (error:any) {
        next(new ErrorHandler(error.message, 500));
    }
});


// Create an event
interface IEvent {
    title: string;
    description: string;
    eventType: string;
    location: string;
    eventDateTime: string;
    reminderTime?: string;
    userId: string;
}

// export const createEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { title, description, eventType, location, eventDateTime } = req.body as IEvent;

//         if (!title || !description || !eventType || !eventDateTime || !location) {
//             return next(new ErrorHandler('All fields are required', 400));
//         }

//         // Check user
//         const userId = req.user?._id;
//         if (!userId) return next(new ErrorHandler('User not found', 404));

//         const user = await userModel.findById(userId);
//         if (!user) return next(new ErrorHandler('User not found', 404));

//         // Convert event date string to Date object
//         const eventDate = new Date(eventDateTime);
//         if (isNaN(eventDate.getTime())) {
//             return next(new ErrorHandler('Invalid date format', 400));
//         }

//         // Calculate reminder time (30 minutes before event)
//         const reminderTime = new Date(eventDate.getTime() - 30 * 60000); // 60000 ms = 1 min

//         const event = {
//             _type: 'event',
//             title,
//             description,
//             eventType,
//             location,
//             eventDateTime: eventDate.toISOString(),  // Ensure it's stored as ISO
//             reminderTime: reminderTime.toISOString(),
//             userId,
//         };

//         const result = await sanity.create(event);

//         return res.status(201).json({ success: true, data: result });
//     } catch (error: any) {
//         next(new ErrorHandler(error.message, 500));
//     }
// });



// events reminder

export const createEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, eventType, location, eventDateTime } = req.body as IEvent;

        if (!title || !description || !eventType || !eventDateTime) {
            return next(new ErrorHandler('All fields are required', 400));
        }

        // If event is online, location should not be provided
        if (eventType.toLowerCase() === "online" && location) {
            return next(new ErrorHandler('Location should not be provided for online events', 400));
        }

        // Check user
        const userId = req.user?._id;
        if (!userId) return next(new ErrorHandler('User not found', 404));

        const user = await userModel.findById(userId);
        if (!user) return next(new ErrorHandler('User not found', 404));

        // Convert event date string to Date object
        const eventDateTimeISO = convertToISO(eventDateTime);
        const eventDate = new Date(eventDateTimeISO);
        if (isNaN(eventDate.getTime())) {
            return next(new ErrorHandler('Invalid date format', 400));
        }


        // Calculate reminder time (30 minutes before event)
        const reminderTime = new Date(eventDate.getTime() - 30 * 60000); // 60000 ms = 1 min

        // Create event object (exclude location if online)
        const event: any = {
            _type: 'event',
            title,
            description,
            eventType,
            eventDateTime: eventDate.toISOString(),
            reminderTime: reminderTime.toISOString(),
            userId,
        };

        if (eventType.toLowerCase() !== "online") {
            event.location = location; // Only add location if event is not online
        }

        const result = await sanity.create(event);

          // Create a reminder document in the reminder schema
          const reminder = {
            _type: 'reminder',
            eventId: {
                _type: 'reference',
                _ref: result._id,
            },
            userId,
            reminderTime: reminderTime.toISOString(),
            sent: false
        };

        // Save reminder to Sanity or your reminder model
       const reminderResult =  await sanity.create(reminder);

        return res.status(201).json({ success: true, data: result,Reminder: reminderResult, message: "Event created successfully" });
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});

// update event
interface IUpdateTask {
    title?: string;
    description?: string;
    eventType?: string;
    location?: string;
    eventDateTime?: string;
}
export const updateEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, eventType, eventDateTime, location } = req.body as IUpdateTask;

        if (!title && !description && !eventDateTime && !eventType && !location) {
            return next(new ErrorHandler('At least one field (title, description, eventType, eventDateTime, location) must be provided', 400));
        }

        // check user
        const userId = req.user?._id;
        if (!userId) return next(new ErrorHandler('User not found', 404));

        const user = await userModel.findById(userId);
        if (!user) return next(new ErrorHandler('User not found', 404));

        // Check if eventDateTime is provided, then convert
        let eventDate;
        let reminderTime;

        if (eventDateTime) {
            const eventDateTimeISO = convertToISO(eventDateTime);
            eventDate = new Date(eventDateTimeISO);
            if (isNaN(eventDate.getTime())) {
                return next(new ErrorHandler('Invalid date format', 400));
            }
            // calculate reminder time (30 minutes before event)
            reminderTime = new Date(eventDate.getTime() - 30 * 60000); // 60000 ms = 1 min
        }

        // check if event exists
        const { id } = req.params;
        const eventQuery = `*[_type == "event" && _id == $id][0]`;
        const event = await sanity.fetch(eventQuery, { id });
        if (!event) return next(new ErrorHandler('Event not found', 404));

        // check event if has location
        if (eventType?.toLowerCase() === "online" && location) {
            return next(new ErrorHandler('Location should not be provided for online events', 400));
        }

        // update event object (exclude location if online)
        const updatedEvent: any = {
            _type: 'event',
            title: title || event.title,
            description: description || event.description,
            eventType: eventType || event.eventType,
            eventDateTime:  eventDate ? eventDate.toISOString() : event.eventDateTime,
            reminderTime: reminderTime ? reminderTime.toISOString() : event.reminderTime,
            userId,
            location: eventType?.toLowerCase() !== "online" ? location || event.location : undefined
        };

        const result = await sanity.patch(event._id).set(updatedEvent).commit();
        res.status(200).json({ success: true, data: result, message: "Event updated successfully" });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});

// delete event
export const deleteEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const query = `*[_type == "event" && _id == $id][0]`;

        // check user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler('User not found', 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const event = await sanity.fetch(query, { id });

        if (!event) {
            return next(new ErrorHandler('Event not found', 404));
        }

        const result = await sanity.delete(id);

        return res.status(200).json({ success: true, data: result });
    } catch (error:any) {
        next(new ErrorHandler(error.message, 500));
    }
});


export const setReminder = async () => {
    cron.schedule('*/5 * * * *', async () => {  // Runs every 5 minutes
        try {
            const now = new Date().toISOString();

            // Fetch reminders that need to be sent
            const query = `*[_type == "reminder" && sent == false && reminderTime <= "${now}"]`;
            const reminders = await sanity.fetch(query);

            if (!reminders.length) {
                console.log('No reminders to send at this time.');
                return;
            }

            for (const reminder of reminders) {
                const event = await sanity.fetch(`*[_type == "event" && _id == $id][0]`, { id: reminder.eventId._ref });
                if (!event) continue;

                // Fetch user info
                const user = await userModel.findById(reminder.userId);
                if (!user) continue;

                // Data for email template
                const emailData = {
                    user: { name: user.name },
                    event: {
                        title: event.title,
                        eventDateTime: new Date(event.eventDateTime).toLocaleString(),
                        location: event.location || 'Online',
                    },
                };

                try {
                    // Send email
                    await sendMail({
                        template: 'reminderEvent.ejs',
                        email: user.email,
                        subject: `Reminder: ${event.title} is coming up in 30 minutes!`,
                        data: emailData,
                    });

                    // Mark reminder as sent in Sanity
                    await sanity.patch(reminder._id).set({ sent: true }).commit();
                    console.log(`Reminder email sent for event: ${event.title}`);

                } catch (error: any) {
                    console.error(`Failed to send email for event ${event.title}:`, error.message);
                }
            }
        } catch (error: any) {
            console.error('Error in cron job:', error.message);
        }
    });
};


export const clearPastEvents = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date().toISOString();
        const query = `*[_type == "event" && endTime < dateTime($now)]`; // Fetch only past events

        // Check logged user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Fetch past events
        const events = await sanity.fetch(query, { now });

        if (events.length === 0) {
            return res.status(200).json({ success: true, message: "No past events found." });
        }

        // Delete past events
        const eventIds = events.map((event: any) => event._id);
        await Promise.all(eventIds.map((id:string) => sanity.delete(id)));

        res.status(200).json({ success: true, message: `Deleted ${events.length} past events.` });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



// archive events
export const archivePastEvents = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date().toISOString();
        const query = `*[_type == "event" && status != "archived" && endTime < dateTime($now)]`;

        // Check logged user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Fetch past events
        const pastEvents = await sanity.fetch(query, { now });

        if (pastEvents.length === 0) {
            return res.status(200).json({ success: true, message: "No past events found." });
        }

        // Archive past events by updating their status
        await Promise.all(pastEvents.map((event: any) =>
            sanity.patch(event._id).set({ status: "archived" }).commit()
        ));

        res.status(200).json({ success: true, message: `Archived ${pastEvents.length} past events.` });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



// unarchive past events
export const restoreArchivedEvent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;

        const updatedEvent = await sanity.patch(eventId).set({ status: "active" }).commit();

        res.status(200).json({ success: true, message: "Event restored successfully.", data: updatedEvent });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
