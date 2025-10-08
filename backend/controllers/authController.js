import userModel from "../models/userModel.js";
import {hashpassword , comparePassword} from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import wishlistModel from "../models/wishlistModel.js";

dotenv.config();

//nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, // Use `true` for port 465, `false` for all other ports
    secure: false,
    auth: {
      user: process.env.HOST_MAIL,
      pass: process.env.HOST_MAIL_PASSWORD,
    },
  });

/*******************************register controller**********************************/
export const registerController = async (req,res)=>{
    try {
        const {name,address,email,phone,password}=req.body;
        
          //validation
        if(!name){
            return res.send({
                message:'name is Required'
            })
        }
        if(!email){
           return res.send({
                message:'email is Required'
            })
        }
        if(!address){
            return res.send({
                message:'address is Required'
            })
        }
        if(!phone){
            return res.send({
                message:'phone is Required'
            })
        }
        if(!password){
            return res.send({
                message:'password is Required'
            })
        }
        


        //check existing user

       const existingUser = await userModel.findOne({email})
        
       if(existingUser){
        return  res.status(201).send({
            success:false,
            message:'Already Registered please login!'
           })
       }

       //register user || password hashing
       const hashedpassword = await hashpassword(password);
       const user = await new userModel({
        name,email,password:hashedpassword,phone,address
    }).save()

       res.status(200).send({
        success:true,
        message:"New user Registerd!",
        user
       })

    } catch (error) {
        res.status(501).send({
            success:false,
            message:'Error in registration!',error
        })
    }
};


/*******************************login controller**********************************/

export const loginController  = async(req,res) =>{
    try {
        const {email,password}=req.body;

        //validation
        if (!email || !password) {
           return res.send({
            message:'Invalid email or password!'
           })
        }

        //check if not register
        const user = await userModel.findOne({email})

        if(!user){
           return res.status(400).send({
                success:false,
                message:'email not register'
            })
        }
       
        //loging user
      
        const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

        //token

        const token =  JWT?.sign({_id:user._id},process.env.TOKEN_SECRET,{expiresIn:'7d'});

        //wishlist user creation
        const userWishlist = await new wishlistModel({
            user:user._id,
            wishlistItems:[]
        })
        await userWishlist.save();

        res.status(200).send({
            success:true,
            message:'User LogIn successfull',
            user:{
                _id:user._id,
                name:user.name,
                phone:user.phone,
                address:user.address,
                email:user.email,
                role:user.role,
                answer:user.answer 
            },token
        })
    } catch (error) {
        res.status(401).send({
            success:false,
            message:'error in login',
            error
        })
    }
}

/**************************forget-password controller*******************************/

export const forgetPasswordController = async(req,res)=>{
 try {
    const {email} = req.body;

        //validation
        if(!email){
            return res.send({
                message:'email is required'
            })
        }
    
        //verifing email
        const user = await userModel.findOne({email})
       
        //validation
        if(!user){
            res.status(401).send({
                message:'Invalid email or answer'
            })
        }else{
      const OTP = Math.floor(1000 + Math.random() * 9000);
    //otp authentiction
    const info = await transporter.sendMail({
    // sender address
    from: process.env.HOST_MAIL,
    // client address
    to: user.email,
      // Subject line
     subject: "Biceps - Ecommerce",
     text: "OTP", 
     // Subject
     html: `<b>${OTP} is your BICEPS-ECOMMERCE OTP, Don't share it with anyone</b>`,
    });

      console.log("Message sent:", info.messageId);
    
            console.log(user)
            res.status(200).send({
                success:true,
                message:'OTP Generated!',
                otp:`${OTP}`
            })
        }

 } catch (error) {
    console.log(error);
    res.status(501).send({
        success:false,
        message:'something went wrong!'
    })
 }
}

//new-password
export const newPasswordController = async(req,res)=>{
 try {
    const {newPassword , confirmPassword ,email } = req.body;

        //validation
       
        if(!newPassword){
            return res.send({
                message:'new Password is required'
            })
        }

        if(!confirmPassword){
            return res.send({
                message:'confirm password is required'
            })
        }

        if(newPassword === confirmPassword){

        const hash = await hashpassword(newPassword)

    await userModel.findOneAndUpdate({email},{password:hash})
    res.status(200).send({
            success:true,
            message:'password updated successfull!'
        })
        }else{
            res.send({
                message:"password doesn't match"
            })
        }
 
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'something went wrong!'
    })
 }
}

/*******************************test controller**********************************/
export const testController = (req ,res)=>{
    try {
        res.status(200).send("Route Protected")
    } catch (error) {
        res.status(400).send(error)
    }
   
}

/****************************profile update controller*******************************/

export const profleUpdateController = async(req,res)=>{
try {
    const {name,address,email,phone,password}=req.body;

    const user = await userModel.findById(req.user._id)

    if(!password && password > 6 ){
        res.json({error:'error in password'})
    }

    const hashedPassword = await hashpassword(password)

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
        name:name || user.name,
        email:email || user.email,
        password:hashedPassword || user.password,
        address:address || user.address,
        phone:phone || user.phone
    },{new:true})
res.status(200).send({
    success:true,
    message:'User profile successfull',
    updatedUser
});
} catch (error) {
    res.status(401).send({
        success:false,
        message:'Error in profile updation',
        error
    })
    
}
}