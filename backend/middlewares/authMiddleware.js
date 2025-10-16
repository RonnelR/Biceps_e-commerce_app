import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware: check if token is valid
export const isSignInRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.TOKEN_SECRET);

    req.user = decoded; // attach user info to req
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware: check admin role
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
