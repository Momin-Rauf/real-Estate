import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    regularPrice:{
        type:Number,
        required:true,
    },
    discountPrice:{
        type:Number,
        required:true, 
    },
    bathrooms:{
        type:Number,
        required:true,
    },
    bedrooms:{
      type:Number,
      required:true, 
    },
    furnished:{
        type:Boolean,
        required:true,
    }
    ,
    parking:{
        type:Boolean,
        required:true,
    },
    
    offer:{
        type:Boolean,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    useRef:{
        type:String,
        required:true,
    },
    imageUrls:{
        type:Array,
        required:true,
    },


    

},{
    timestamps: true,
});

const listing = mongoose.model("listing",ListSchema);

export default listing;