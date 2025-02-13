import {  userModel } from "../models/usermodel";
import  { Response, Request, NextFunction } from 'express';
import validator from 'validator';
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
// register
interface user {
    name: string;
    email: string;
    password: string;
}

export const registerUser = catchAsyncErrors(async (res:Response, req: Request,next: NextFunction) => {

   try {
     const { name, email, password } = req.body as user;
     if(!name || !email || !password){
         return next(new ErrorHandler("All fields are required",400))
     }

      //validate email
      const isValidEmail = validator.isEmail(email);
      if (!isValidEmail) {
        return next(new ErrorHandler("Incorrect email format", 400));
      }

      //validate password
      const isValidPassword = validator.isStrongPassword(password);
      if (!isValidPassword) {
        return next(
          new ErrorHandler(
            "Password should be at least 8 characters, have at least one uppercase letter, one numerical value and one special character",
            400
          )
        );
      }
 
     // check if user already exists
     const userEmail = await userModel.findOne({email});
     if(userEmail){
         return next(new ErrorHandler('Email already exists',400));
     }
 
     // save user
     const data = {
         name,
         email,
     }
 
     res.status(200).json({success: true, data, message: 'User saved successfully'});
 
   } catch (error:any) {
    return next(new ErrorHandler(error.message, 500));
   }


});