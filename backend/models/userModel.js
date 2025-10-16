import mongoose , {Schema, mongo} from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true
     },
     phone:{
        type:String,
        required:true,
     },
     address:{
        type:String,
        required:true
     },
      wishlist:[
         {
            type:mongoose.Schema.Types.ObjectId,
         ref:"products"
      },
      ],

     role:{ 
        type:Number,
        default:0
     }
}, {timestamps: true})

export default mongoose.model("users",userSchema);