
import { createClient } from "@sanity/client";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";
import { sendMail } from "../utils/mail";
import ErrorHandler from "../utils/ErrorHandler";
import cron from 'node-cron';

const sanity = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-01-01',
    token: process.env.SANITY_API_TOKEN,
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

export const convertToISO = (dateString: string): string => {
    // Convert "23/02/2025 16:00" → "2025-02-23T16:00:00.000Z"
    const [day, month, yearAndTime] = dateString.split("/");
    const [year, time] = yearAndTime.split(" ");

    // Ensure the time is in UTC format before converting to ISO string
    const dateISO = new Date(`${year}-${month}-${day}T${time}:00.000Z`).toISOString();
    
    return dateISO;
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


interface Itask {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status: string;
    userId: string;
}

// Reminder Task Expiry
export const reminderTaskExpiry = () => {
    cron.schedule("*/10 * * * *", async () => { // Runs every 10 minutes
        try {
            const now = new Date().toISOString();

            // Get users who have auto-completion enabled
            const usersWithAutoComplete = await userModel.find({ autoCompleteTasks: true }).select("_id email name");

            if (usersWithAutoComplete.length === 0) return;

            // Extract user IDs
            const userIds = usersWithAutoComplete.map(user => user._id as string);

            // Fetch expired tasks for these users
            const expiredTasks = await sanity.fetch(
                `*[_type == "task" && status != "done" && endTime < dateTime($now) && userId in $userIds]`,
                { now, userIds }
            );

            if (expiredTasks.length === 0) return;

            // Mark tasks as done in bulk
            await Promise.all(expiredTasks.map((task: Itask) =>
                sanity.patch(task._id).set({ status: "done" }).commit()
            ));
            console.log(`✅ Marked ${expiredTasks.length} tasks as done.`);

            // Group tasks by user
            const tasksByUser: Record<string, Itask[]> = {};
            expiredTasks.forEach((task:Itask) => {
                tasksByUser[task.userId] = tasksByUser[task.userId] || [];
                tasksByUser[task.userId].push(task);
            });

            // Prepare and send emails only to users with expired tasks
            const emailPromises = Object.entries(tasksByUser).map(async ([userId, tasks]) => {
                const user = usersWithAutoComplete.find(user => user._id as string === userId);
                if (!user) return console.log(`User not found with ID: ${userId}`);

                const data = {
                    user: { name: user.name },
                    tasks,
                };

                try {
                    await sendMail({
                        template: 'reminderTaskExpiry.ejs',
                        email: user.email,
                        subject: `Task Expiry Reminder - ${tasks.length} Task(s) Expired`,
                        data,
                    });
                    console.log(`📩 Email sent to ${user.email}`);
                } catch (error: any) {
                    console.error(`❌ Failed to send email to ${user.email}: ${error.message}`);
                }
            });

            await Promise.all(emailPromises); // Send all emails at once
        } catch (error: any) {
            console.error(`❌ Reminder Task Expiry Error: ${error.message}`);
        }
    });
};




// clear one done task
export const clearTask = catchAsyncErrors(async (req: Request, res: Response,next:NextFunction)=>{
    try {

          // check event id
          const {id} = req.params;
          if(!id){
              return next(new ErrorHandler("Id is not valid",400));
          }

           // check logged user
            const userId = req.user?._id;
            if(!userId){
                return next(new ErrorHandler("user not found",404));
            }

        const query = `*[_type == "task" && _id = $id[0] && status == "done" && userId == "${userId}]`;

       
        
        const user = await userModel.findById(userId);
        if(!user){
            return next(new ErrorHandler("user not found",404))
        }

      

        // check the events
        const task = await sanity.fetch(query,{id});
        if(!task){
            return next(new ErrorHandler("Event not Found",404));
        }

        // delete event
        const result = await sanity.delete(id);

        res.status(200).json({success:true, data: result,message: "Event deleted successfully"});
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
})



// Clear completed tasks
export const clearTasks = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check logged-in user
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Query events that are marked as 'done' and belong to the user
        const query = `*[_type == "task" && status == "done" && userId == "${userId}"]`;
        const tasks = await sanity.fetch(query);

        if (!tasks.length) {
            return next(new ErrorHandler("Completed tasks not found", 404));
        }

        // Extract event IDs and delete them
        const taskIds = tasks.map((task: any) => task._id);
        await Promise.all(taskIds.map((id:string) => sanity.delete(id)));

        res.status(200).json({ success: true, message: "Tasks deleted successfully" });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});