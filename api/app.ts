import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './Routes/user.route';
import eventsRoute from './Routes/events.route';
import tasksRoute from './Routes/tasks.route';
export const app = express();
import 'dotenv/config';

//body parser
app.use(express.json({limit: "50mb"})); 
app.use(express.urlencoded({extended: true}));

//cookie-parser
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000",  // Allow frontend
    credentials: true,  // Allow cookies, sessions
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};

app.use(cors(corsOptions));


//routes
//api/user
app.use("/api/user", userRoute);
app.use("/api/events",eventsRoute)
app.use("/api/tasks",tasksRoute)


//test 
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({success: true, message: "API working correctly"});
})

//unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`The route: ${req.originalUrl} does not exist`) as any;
    error.statusCode = 404;
    next(error);
})

//404 page
app.use("/", (error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({success: false, message: error.message})
})