import express from 'express';
import { activateUser, getUserInfo, logoutUser, registerUser, userLogin } from '../controllers/user.controller';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';

const route = express.Router();

// api/user/user-register
route.post('/user-register', registerUser);

// api/user/activate-user
route.post('/activate-user', activateUser);

// api/user/user-login  (Login)
route.post('/user-login', userLogin);

// api/user/user-logout (Logout)
route.post('/user-logout',authMiddleware, logoutUser);

// api/user/user-info
route.get('/user-info',authMiddleware,authorizeRoles("admin"), getUserInfo);



export default route;