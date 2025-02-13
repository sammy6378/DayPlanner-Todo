import { app } from "./app";
import express from 'express';
import 'dotenv/config'
import { connectDb } from "./db/connect";


// port
const port = process.env.PORT || 3000;

// database url
const url = process.env.MOGODB_URL as string;


app.use(express.json());

// server
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
    // connect to MongoDB
    connectDb(url);
})

