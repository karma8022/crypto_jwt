import express from 'express';
import mongoose, { mongo } from 'mongoose';
import userRoutes from './routes/user.route.js';

mongoose.connect("mongodb+srv://actspot:actspot2024@mern-blog.m526lr4.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=mern-blog").then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

const app=express();

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

app.use('/api/user',userRoutes)