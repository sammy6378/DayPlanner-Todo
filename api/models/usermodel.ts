import mongoose from 'mongoose';

export interface IUser  {
    name: string;
    email: string;
    password: string;
    date: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        minlength: 6,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        select: false,  // hide password in response
    },
    date: { type: Date, default: Date.now }
},{timestamps: true})



// user model
export const userModel = mongoose.model<IUser>('User', userSchema);