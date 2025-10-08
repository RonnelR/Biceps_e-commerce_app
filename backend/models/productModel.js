import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema([{
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
    },
    shipping:{
        type:Boolean
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Categories',
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    }
}],{timestamps:true});

export default mongoose.model('products',productSchema);