import { app } from "./app";
import express from 'express';
import 'dotenv/config'
import { connectDb } from "./utils/connect";


// port
const port = process.env.PORT || 3000;


app.use(express.json());

// server
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
    // connect to MongoDB
    connectDb();
})

