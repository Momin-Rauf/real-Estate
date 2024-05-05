
import listing from "../models/listing.model.js";
export const create = async(req,res,next)=>{
    try {
        const listings = new listing(req.body);
        try {
            await listings.save();
            res.status(201).json("list added");
          } catch (error) {
            next(error);
          }
    } catch (error) {
        next(error)
    }
};