import userModel from "../models/userModel.js";
import {hashpassword , comparePassword} from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";


/*******************************register controller**********************************/
export const registerController = async (req,res)=>{
    try {
        const {name,address,email,phone,password,answer}=req.body;
        
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
        if(!answer){
            return res.send({
                message:'answer in required'
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
        name,email,password:hashedpassword,phone,address,answer
    }).save()
       res.status(200).send({
        success:true,
        message:"New user Registerd!",
        user
       })

    } catch (error) {
        res.status(500).send({
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

        const token = JWT.sign({_id:user._id},process.env.TOKEN_SECRET,{expiresIn:'7d'});

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
    const {email,answer,newPassword} = req.body;

        //validation
        if(!email){
            return res.send({
                message:'email is required'
            })
        }
        if(!answer){
            return res.send({
                message:'answer is required'
            })
        }
        if(!newPassword){
            return res.send({
                message:'newPassword is required'
            })
        }
 
        //password hassing
        const user = await userModel.findOne({email,answer})
       
        //validation
        if(!user){
            res.status(401).send({
                message:'Invalid email or answer'
            })
        }
        const hash = await hashpassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hash})
    res.status(200).send({
            success:true,
            message:'password updated successfull!'
        })
       
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