
import { registerUser } from "../controllers/userController";
import express from 'express';


export const route = express.Router();

route.post('/register', registerUser);


export default route;