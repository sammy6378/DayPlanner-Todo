import mongoose from 'mongoose';


export const connectDb = (MONGO_URL: string) =>{
    try{
        mongoose.connect(MONGO_URL);
        console.log('MongoDB Connected...');
    }catch(e){
        console.log('MongoDB Connect failed: ' + e.message);
    }
}