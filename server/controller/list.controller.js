
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
        console.log("error");
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
    console.log(error);
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
      console.log(error)
    }
    
  }

export const getListing = async(req,res,next)=>{
  try {
    const property = await listing.findById(req.params.id);
    return res.status(201).json(property);
  } catch (error) {
    console.log(error)
  }
}


export const getListings = async (req, res, next) => {
  console.log('123');
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    
    
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }
    
    let furnished = req.query.furnished;
    
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }
    
    let parking = req.query.parking;
    
    if (parking === undefined || parking === 'false') {
      parking = false;
    }
    
    let type = req.query.type;
    
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    
    const searchTerm = req.query.searchTerm || '';
    
    const sort = req.query.sort || 'createdAt';
    
    const order = req.query.order || 'desc';
    
    const listings = await listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      type,
    })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);
    return res.status(201).json(listings);
    
  } catch (error) {
    console.log(error);
  }
};