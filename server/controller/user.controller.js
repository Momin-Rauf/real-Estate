import { response } from "express";
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
export const test = (req,res)=>{
    res.json({
        message:"Hello world!",
    });
}
export const updateUser = async(req,res,next)=>{
    if(req.user.id === req.params.id){
        console.log(req.user.id,req.params.id,req.user.id === req.params.id);
        if(req.body.password){
            console.log(req.body.password);
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        console.log(123)
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                photo:req.body.photo,
            }
        },{new: true});
        const {password,...rest} = updateUser._doc;
        res.status(200).json(rest);
    }
    else{
        return next(new Error("Invalid ID"));
    }
}