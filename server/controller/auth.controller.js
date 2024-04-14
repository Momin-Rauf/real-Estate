import User from "../models/user.model.js";
import bycryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bycryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  
  try {
    await newUser.save();
    res.status(201).json("new user added successfully");
  } catch (error) {
    next(error);
  }
};

//login function
export const login = async(req,res,next)=>{
    const {password,email} = req.body;
    console.log(password,email)

    try {

        //email check
        const UserData = await User.findOne({email});
        
        if (!UserData) {
            return res.status(404).json({ error: "User does not exist" });
          }
      
          // Compare passwords
          const isPasswordValid = await bycryptjs.compareSync(password, UserData.password);
      
          if (!isPasswordValid) {
            return res.status(401).json({ error: "Wrong password" });
          }
        const token = jwt.sign({id:UserData._id},process.env.JWT_SECRET_KEY);
        const {password:pass, ...rest} = UserData._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

        
    } catch (error) {
        next(error);
    }

    
}
