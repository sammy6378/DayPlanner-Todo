import mongoose from 'mongoose';
import 'dotenv/config'

// database url
const url = process.env.MONGODB_URL as string;

export const connectDb = async () =>{
    try{
       await mongoose.connect(url);
        console.log('MongoDB Connected...');
    }catch(e){
        console.log('MongoDB Connect failed: ' + e.message);
    }
}