import { createClient } from "@sanity/client";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";
import { sendMail } from "../utils/mail";
import ErrorHandler from "../utils/ErrorHandler";

const sanity = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-01-01',
    token: process.env.SANITY_API_TOKEN,
});


// events reminder
export const setReminder = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = `*[_type == "reminder" && sent == false && reminderTime <= now()]`;
        const reminders = await sanity.fetch(query);

        if (reminders.length === 0) {
            return res.status(200).json({ success: true, message: 'No reminders to send' });
        }

        for (const reminder of reminders) {
            if (!reminder.eventId || !reminder.eventId._ref) {
                console.log(`Invalid event reference in reminder ID: ${reminder._id}`);
                continue;
            }

            // Extract actual event ID
            const eventId = reminder.eventId._ref;

            // Fetch event details
            const eventQuery = `*[_type == "event" && _id == $eventId][0]`;
            const event = await sanity.fetch(eventQuery, { eventId });

            if (!event) {
                console.log(`Event not found for reminder ID: ${reminder._id}`);
                continue;
            }

            // Check if user exists in MongoDB
            const user = await userModel.findById(reminder.userId);
            if (!user) {
                console.log(`User not found with ID: ${reminder.userId}`);
                continue;
            }

            // Data to pass to the email template
            const data = {
                user: { name: user.name },
                event,
                eventLink: `${process.env.FRONTEND_URL}events/${event._id}`,
            };

            try {
                // Send email using EJS template
                await sendMail({
                    template: 'reminderEvent.ejs',
                    email: user.email,
                    subject: `Reminder: ${event.title}`,
                    data,
                });

                // Mark reminder as sent in Sanity
                const result = await sanity.patch(reminder._id).set({ sent: true }).commit();
                console.log(`Reminder ${reminder._id} marked as sent:`, result);
            } catch (error: any) {
                console.error(`Failed to send email to ${user.email}: ${error.message}`);
            }
        }

        res.status(200).json({ success: true, message: 'Reminders processed successfully' });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// get one task
export const getTask = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        // query
        const query = `*[_type == "task" && userId == $userId]`;

        // check user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // check task related to user
        const tasks = await sanity.fetch(query, { userId });
        res.status(200).json({ success: true, data: tasks });
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
        
    }
});


// get all tasks
export const getAllTasks = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const query = "*[_type == 'task']";

        // check user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // fetch all tasks
        const tasks = await sanity.fetch(query);
        res.status(200).json({ success: true, data: tasks });
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
        
    }
})

// add tasks
interface ITask {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status?: string;
}

const convertToISO = (dateString: string): string => {
    // Convert "23/02/2025 16:00" → "2025-02-23T16:00:00.000Z"
    const [day, month, yearAndTime] = dateString.split("/");
    const [year, time] = yearAndTime.split(" ");
    
    return new Date(`${year}-${month}-${day}T${time}:00.000Z`).toISOString();
};

export const addTask = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { title, description, startTime, endTime, status } = req.body as ITask;

        if (!title || !description || !startTime || !endTime) {
            return next(new ErrorHandler("Please fill in all fields", 400));
        }

        // Convert dates to ISO 8601 format before saving to Sanity
        if (startTime) {
            startTime = convertToISO(startTime);
        }
        if (endTime) {
            endTime = convertToISO(endTime);
        }

        // Set default status if not provided
        if (!status) {
            status = "todo";
        }

        // Check if user exists in MongoDB
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // **✅ Check if task already exists for this user**
        const existingTasks = await sanity.fetch(
            `*[_type == "task" && title == $title && startTime == $startTime && userId == $userId]`,
            { title, startTime, userId }
        );

        if (existingTasks.length > 0) {
            return next(new ErrorHandler("Task already exists!", 400));
        }

        // Create task in Sanity
        const task = {
            _type: "task",
            title,
            description,
            startTime,
            endTime,
            status,
            userId,
        };

        const result = await sanity.create(task);
        res.status(201).json({ success: true, data: result, message: "Task created successfully" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// update tasks

interface IUpdateTask {
    taskId: string;
    title?: string;
    description?: string;
    status: string,
    startTime?: string;
    endTime?: string;
}

export const updateTask = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {

try {
        let { taskId, title, description, startTime, endTime, status } = req.body as IUpdateTask;
    
        if (!title && !description && !startTime && !endTime && !status) {
            return next(new ErrorHandler("Please provide at least one field to update", 400));
        }
    
        // check tasks
        const task = await sanity.fetch(`*[_type == "task" && _id == $taskId][0]`, { taskId });
        if (!task) {
            return next(new ErrorHandler("Task not found", 404));
        }
    
        // check user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }
    
        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
    
    
        // Convert dates to ISO 8601 format before saving to Sanity
            if (startTime) {
                startTime = convertToISO(startTime);
            }
            if (endTime) {
                endTime = convertToISO(endTime);
            }
    
        // Update task in Sanity
        const update = {
            _id: taskId,
            _type: "task",
            title,
            description,
            status,
            startTime,
            endTime,
        };
    
        const result = await sanity.patch(taskId).set(update).commit();
        res.status(200).json({ success: true, data: result, message: "Task updated successfully" });
    
} catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    
}
});


// delete tasks
export const deleteTask = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.body;

           // Check if user exists in MongoDB
           const userId = req.user?._id;
           if (!userId) {
               return next(new ErrorHandler("User not found", 404));
           }

        // Check if task exists in Sanity
        const task = await sanity.fetch(`*[_type == "task" && _id == $taskId][0]`, { taskId });
        if (!task) {
            return next(new ErrorHandler("Task not found", 404));
        }

        // **Check if the task belongs to the logged-in user**
        if (task.userId !== userId) {
            return next(new ErrorHandler("You are not authorized to delete this task", 403));
        }

        // Check if user exists in MongoDB
        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Delete task from Sanity
        const result = await sanity.delete(taskId);
        res.status(200).json({ success: true, data: result, message: "Task deleted successfully" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});