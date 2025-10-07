import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from 'dotenv'

dotenv.config()

//checking is user already logedin
export const isSignInRequired =async (req,res,next)=>{
    try {
        const decode =  JWT.verify(req.headers.authorization ,process.env.TOKEN_SECRET );
         req.user =  decode;
        next();
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message:'Error in JWT'
      })
    }
};

//checking Admin
export const isAdmin = async (req,res,next)=>{
    try {
      const user = await userModel.findById(req.user._id);
      if(user.role !== 1){
        return res.status(401).send({
            success:false,
            message:"UnAuthorized User"
        });
      }else{
        next();
      }
        
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:'error in admin middleware',error
        });
    }
};