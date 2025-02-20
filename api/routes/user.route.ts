import express from 'express';
import { activateUser, getUserInfo, logoutUser, registerUser, userLogin,setReminder } from '../controllers/user.controller';

const route = express.Router();

// api/user/user-register
route.post('/user-register', registerUser);

// api/user/activate-user
route.post('/activate-user', activateUser);

// api/user/user-login  (Login)
route.post('/user-login', userLogin);

// api/user/user-logout (Logout)
route.post('/user-logout', logoutUser);

// api/user/user-info
route.get('/user-info', getUserInfo);

// api/user/event-reminders
route.get('/event-reminders', setReminder);

export default route;