import express from 'express'
import { addTask, deleteTask, getAllTasks, getTask, updateTask } from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const route = express.Router();


// api/tasks/get-task
route.get('/get-task',authMiddleware, getTask);

// api/tasks/get-tasks
route.get('/get-tasks',authMiddleware, getAllTasks);

// api/tasks/add-tasks
route.post('/add-tasks',authMiddleware, addTask);

// api/tasks/update-tasks
route.put('/update-task',authMiddleware, updateTask);

// api/tasks/delete-task
route.delete('/delete-task',authMiddleware, deleteTask);


export default route;