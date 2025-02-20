import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import useRouter from './Routes/user.route';

export const app = express();

// body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// cookie parser
app.use(cookieParser());

// Routes
app.use('/api/user', useRouter);

// server
app.get('/test', (req: Request, res: Response, next: NextFunction)=>{
    res.status(200).json({success: true,message: 'Server is running'});
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