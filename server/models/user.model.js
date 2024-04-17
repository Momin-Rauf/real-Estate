import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        default:"https://www.google.com/imgres?q=user%20profile&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F005%2F129%2F844%2Fsmall_2x%2Fprofile-user-icon-isolated-on-white-background-eps10-free-vector.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fuser-profile&docid=5Xv8jhEEnCyV3M&tbnid=xG8Q4QsZ94cpEM&vet=12ahUKEwiF1L_R98eFAxVTTqQEHWrqDDUQM3oECBUQAA..i&w=400&h=400&hcb=2&ved=2ahUKEwiF1L_R98eFAxVTTqQEHWrqDDUQM3oECBUQAA"
    },
},{
    timestamps: true,
});

const User = mongoose.model("User",userSchema);

export default User;