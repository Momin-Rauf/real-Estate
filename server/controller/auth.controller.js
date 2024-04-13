import User from '../models/user.model.js';
import bycryptjs from 'bcryptjs';
export const signup=async(req,res,next)=>{
    const {username,email,password} = req.body;
    const hashPassword = bycryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hashPassword});
   try 
   {
    await newUser.save();
    res.status(201).json("new user added successfully");
   }

   catch (error){
    next(error);
   }

    
}