import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to Database sucessfull ${conn.connection.host}`.bgMagenta.   white)
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
    } 

export default connectDB;