
import { userModel } from "../models/usermodel";
import { Response, Request, NextFunction } from "express";
import validator from "validator";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import bcrypt from "bcryptjs";

// register
interface IUser {
  name: string;
  email: string;
  password: string;
}

export const registerUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body as IUser;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Incorrect email format", 400));
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return next(
        new ErrorHandler(
          "Password should be at least 8 characters, have at least one uppercase letter, one numerical value, and one special character",
          400
        )
      );
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
      message: "User registered successfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});
