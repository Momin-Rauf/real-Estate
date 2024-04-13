import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


//routers
import userRouter from './route/user.route';



mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected with mongodb")
}).catch((err)=>{
    console.log(err);
})
const app = express();
app.listen(3000,()=>{
    console.log("server is running")
});


app.use('/api/user',userRouter);