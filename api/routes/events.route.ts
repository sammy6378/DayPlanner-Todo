import express from 'express'
import { addTask, deleteTask, getAllTasks, getTask, setReminder, updateTask } from '../controllers/events.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const route = express.Router();


// api/events/event-reminders
route.get('/event-reminders', setReminder);

// api/events/get-task
route.get('/get-task',authMiddleware, getTask);

// api/events/get-tasks
route.get('/get-tasks',authMiddleware, getAllTasks);

// api/events/add-tasks
route.post('/add-tasks',authMiddleware, addTask);

// api/events/update-tasks
route.put('/update-task',authMiddleware, updateTask);

// api/events/delete-task
route.delete('/delete-task',authMiddleware, deleteTask);


export default route;