import { response } from "express";
import User from "../models/user.model.js";
import listing from '../models/listing.model.js';
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


export const deleteUser = async(req,res,next) => {
    if(req.user.id === req.params.id){
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted");
    }
    else{
        return next(new Error("Invalid ID"));
    }
}

export const logout = async(req,res,next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('logged out');
    } catch (error) {
        return next(new Error("Invalid ID"));
    }
}

export const getUserListing = async(req,res,next) => {
    if (req.user.id === req.params.id){
        console.log(req.params.id);
        try {
            const listings  = await listing.find({useRef:req.params.id});
            res.status(200).json(listings);

        } catch (error) {
            next(error);
        }
        }
    else{
        return next("only view you lists");
    }}