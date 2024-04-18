import express from 'express';
import mongoose, { mongo } from 'mongoose';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

mongoose.connect("mongodb+srv://actspot:actspot2024@mern-blog.m526lr4.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=mern-blog").then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

const app=express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
        
    })

})