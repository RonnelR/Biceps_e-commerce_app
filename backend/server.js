import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routers/authRoute.js";
import categoryRoutes from './routers/categoryRoutes.js'
import productRoutes from './routers/productRoutes.js'
import cors from 'cors'
// import path from 'path'
// import {fileURLToPath} from 'url'

//config dotenv
dotenv.config();

//configure database
connectDB();

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middlewares
colors.enable();
app.use (cors())
app.use(express.json())
app.use(morgan('dev'))
// app.use(express.static(path.join(__dirname,'./client/build')))

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product' , productRoutes);

//rest api
app.get("*", function(req,res){
    // res.sendFile(path.join(__dirname,'./client/build/index.html'));
})

//PORT || creating server

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`The server is running on Port ${PORT}`.bgCyan.white)
})
