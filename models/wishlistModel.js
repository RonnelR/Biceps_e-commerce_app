import mongoose, { modelNames } from 'mongoose'

const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        ref:'users',
        required:true
    },
    wishlistItems:[{
        type:mongoose.ObjectId,
        ref:'products',
        required:true
    }]
},{timestamps:true})

export default new mongoose.model('wishlist', wishlistSchema);