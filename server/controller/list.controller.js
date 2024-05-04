
import listing from "../models/listing.model.js";
export const create = async(req,res,next)=>{
    try {
        const listings = new listing(req.body);
        return res.status(201).json(listings);
    } catch (error) {
        next(error)
    }
};