
// import listing from "../models/listing.model.js";
// export const create = async(req,res,next)=>{
//     try {
//         const listings = new listing(req.body);
//         try {
//             await listings.save();
//             res.status(201).json("list added");
//           } catch (error) {
//             console.log("error");
//           }
//     } catch (error) {
//         console.log("error");
//     }
// };

// export const deleteListing = async (req, res, next) => {
//   const listings = await listing.findById(req.params.id);

//   if (!listings) {
//     console.log("error");
//   }

//   if (req.user.id !== listings.useRef) {
//     console.log("error");
//   }

//   try {
//     await listing.findByIdAndDelete(req.params.id);
//     res.status(200).json('Listing has been deleted!');
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const updateListing = async(req,res,next)=>{
//     const listings  = await listing.findById(req.params.id);
//     if (!listings) {
//       console.log("error");
//     }
//     if (req.user.id !== listings.useRef){
//       console.log("error");
//     }
    
//     try {
//       const updatedListing = await listing.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new:true }
//       );
//     } catch (error) {
//       console.log(error)
//     }
    
//   }

// export const getListing = async(req,res,next)=>{
//   try {
//     const property = await listing.findById(req.params.id);
//     return res.status(201).json(property);
//   } catch (error) {
//     console.error(error);
//     next(error); 
//   }
// }


// export const getListings = async (req, res, next) => {
//   console.log('123');
//   try {
//     const limit = parseInt(req.query.limit) || 9;
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     let offer = req.query.offer;

    
    
//     if (offer === undefined || offer === 'false') {
//       offer = { $in: [false, true] };
//     }
    
//     let furnished = req.query.furnished;
    
//     if (furnished === undefined || furnished === 'false') {
//       furnished = { $in: [false, true] };
//     }
    
//     let parking = req.query.parking;
    
//     if (parking === undefined || parking === 'false') {
//       parking = false;
//     }
    
//     let type = req.query.type;
    
//     if (type === undefined || type === 'all') {
//       type = { $in: ['sale', 'rent'] };
//     }

    
//     const searchTerm = req.query.searchTerm || '';
    
//     const sort = req.query.sort || 'createdAt';
    
//     const order = req.query.order || 'desc';
    
//     const listings = await listing.find({
//       name: { $regex: searchTerm, $options: 'i' },
//       offer,
//       furnished,
//       type,
//     })
//     .sort({ [sort]: order })
//     .limit(limit)
//     .skip(startIndex);
//     return res.status(201).json(listings);
    
//   } catch (error) {
//     console.log(error);
//   }
// };




import listing from "../models/listing.model.js";

export const create = async (req, res, next) => {
  try {
    const newListing = new listing(req.body);
    await newListing.save();
    res.status(201).json("list added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listingToDelete = await listing.findById(req.params.id);
    if (!listingToDelete) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (req.user.id !== listingToDelete.useRef) {
      return res.status(403).json({ error: "You are not authorized to delete this listing" });
    }

    await listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listingToUpdate = await listing.findById(req.params.id);
    if (!listingToUpdate) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (req.user.id !== listingToUpdate.useRef) {
      return res.status(403).json({ error: "You are not authorized to update this listing" });
    }

    const updatedListing = await listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

export const getListing = async (req, res, next) => {
  try {
    const property = await listing.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get listing" });
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let { offer, furnished, parking, type, searchTerm, sort, order } = req.query;

    offer = offer === undefined || offer === 'false' ? { $in: [false, true] } : offer;
    furnished = furnished === undefined || furnished === 'false' ? { $in: [false, true] } : furnished;
    parking = parking === undefined || parking === 'false' ? false : true;
    type = type === undefined || type === 'all' ? { $in: ['sale', 'rent'] } : type;
    searchTerm = searchTerm || '';
    sort = sort || 'createdAt';
    order = order || 'desc';

    const listings = await listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      type,
    })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get listings" });
  }
};
