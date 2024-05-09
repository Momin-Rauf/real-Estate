
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

export const deleteListing = async (req, res, next) => {
  const listings = await listing.findById(req.params.id);

  if (!listings) {
    return next('Listing not found!');
  }

  if (req.user.id !== listings.useRef) {
    return next('You can only delete your own listings!');
  }

  try {
    await listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async(req,res,next)=>{
    const listings  = await listing.findById(req.params.id);
    if (!listings) {
      return next("List not Found");
    }
    if (req.user.id !== listings.useRef){
      return next('Permision Denied');
    }
    
    try {
      const updatedListing = await listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new:true }
      );
    } catch (error) {
      next('error');
    }
    
  }

export const getListing = async(req,res,next)=>{
  try {
    const property = await listing.findById(req.params.id);
    return res.status(201).json(property);
  } catch (error) {
    next('error detected at getting the list')
  }
}