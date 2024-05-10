import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import path from 'path';

//routers
import listingRouter from './route/listing.route.js';
import userRouter from './route/user.route.js';
import authRouter from './route/auth.route.js';


//connecting with mongodb
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected with mongodb")
}).catch((err)=>{
    console.log(err);
})


const __dirname = path.resolve();

const app = express();
app.use(express.json());
//cool
app.listen(3000,()=>{
    console.log("server is running")
});


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})
app.use(cookieParser());
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);


app.use('/api/user',userRouter);
app.use((err,req,res,next)=>{
    const code = err.statusCode || 500;
    const message = err.message;
    return res.status(code).json({
        success:false,
        code,
        message
    });
});