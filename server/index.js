import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


//routers
import userRouter from './route/user.route.js';
import authRouter from './route/auth.route.js';


//connecting with mongodb
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected with mongodb")
}).catch((err)=>{
    console.log(err);
})


const app = express();
app.use(express.json());
app.listen(3000,()=>{
    console.log("server is running")
});


app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use((err,req,res,next)=>{
    const code = err.statusCode || 500;
    const message = err.message;
    return res.status(code).json({
        success:false,
        code,
        message
    });
});