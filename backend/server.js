import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routers/authRoute.js";
import categoryRoutes from './routers/categoryRoutes.js';
import productRoutes from './routers/productRoutes.js';
import cors from 'cors';

//config dotenv
dotenv.config();

//configure database
connectDB();

//rest object
const app = express();

const allowedOrigins = [
  "http://localhost:3000",         // local dev
  "https://biceps-e-commerce-app.onrender.com"  // deployed frontend
];

//middleware
colors.enable();
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
//middlewares
colors.enable();

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Default route for Render health check
app.get("/", (req, res) => {
  res.send("Biceps Backend API is running successfully!");
});

//PORT || creating server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The server is running on Port ${PORT}`.bgCyan.white);
});
