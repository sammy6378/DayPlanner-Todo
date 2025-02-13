import express, { Response, Request, NextFunction } from 'express';
import 'dotenv/config'
import cors from 'cors';
import userRoute from './routes/user.route';


export const app = express();


//body parser
app.use(express.json({limit: "50mb"})); 
app.use(express.urlencoded({extended: true}));

// cors
const corOptions ={
    origin: process.env.ORIGIN,
}


app.use(cors(corOptions));

// routes
app.use('/api/user',userRoute);

// test
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