import mongoose  from 'mongoose';

const orderSchema = new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:'products'
        
    }],
    buyers:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    payment:{},
    status:{
        type:"string",
        default:"Not Processing",
        enum:["Not Processing","Processing","Shipped","Delivered","Cancel"]
    }
},{timestamps:true})

export default mongoose.model('orders',orderSchema)