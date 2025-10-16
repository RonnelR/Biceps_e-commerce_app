import userModel from "../models/userModel.js";
import { hashpassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ---------------------- Nodemailer Setup ------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.HOST_MAIL_PASSWORD,
  },
});

// ====================== REGISTER CONTROLLER ======================
export const registerController = async (req, res) => {
  try {
    const { name, address, email, phone, password } = req.body;

    // Validation
    if (!name) return res.send({ message: "Name is required" });
    if (!email) return res.send({ message: "Email is required" });
    if (!address) return res.send({ message: "Address is required" });
    if (!phone) return res.send({ message: "Phone is required" });
    if (!password) return res.send({ message: "Password is required" });

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "Already Registered, please login!",
      });
    }

    // Register user
    const hashedpassword = await hashpassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedpassword,
      phone,
      address,
    }).save();

    res.status(200).send({
      success: true,
      message: "New user registered!",
      user,
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: "Error in registration!",
      error,
    });
  }
};

// ====================== LOGIN CONTROLLER ======================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.send({ message: "Invalid email or password!" });
    }

    // Check user
    const user = await userModel.findOne({ email }).populate("wishlist");
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Email not registered",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = JWT.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "User login successful",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
      },
      token,
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// ====================== FORGOT PASSWORD CONTROLLER ======================
export const forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email" });
    }

    const OTP = Math.floor(1000 + Math.random() * 9000);
    const info = await transporter.sendMail({
      from: process.env.HOST_MAIL,
      to: user.email,
      subject: "Biceps - Ecommerce",
      html: `<b>${OTP} is your BICEPS-ECOMMERCE OTP. Don't share it with anyone.</b>`,
    });

    console.log("OTP email sent:", info.messageId);

    res.status(200).send({
      success: true,
      message: "OTP Generated!",
      otp: `${OTP}`,
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// ====================== NEW PASSWORD CONTROLLER ======================
export const newPasswordController = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;

    if (!newPassword)
      return res.send({ message: "New password is required" });
    if (!confirmPassword)
      return res.send({ message: "Confirm password is required" });

    if (newPassword !== confirmPassword) {
      return res.send({ message: "Passwords do not match" });
    }

    const hash = await hashpassword(newPassword);
    await userModel.findOneAndUpdate({ email }, { password: hash });

    res.status(200).send({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// ====================== TEST CONTROLLER ======================
export const testController = (req, res) => {
  try {
    res.status(200).send("Route Protected");
  } catch (error) {
    res.status(400).send(error);
  }
};

// ====================== PROFILE UPDATE CONTROLLER ======================
export const profleUpdateController = async (req, res) => {
  try {
    const { name, address, email, phone, password } = req.body;

    const user = await userModel.findById(req.user._id);

    let hashedPassword = user.password;
    if (password) {
      if (password.length < 6) {
        return res.json({ error: "Password must be at least 6 characters" });
      }
      hashedPassword = await hashpassword(password);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword,
        address: address || user.address,
        phone: phone || user.phone,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in profile update",
      error,
    });
  }
};

// ====================== ADD PRODUCT TO WISHLIST ======================
export const addProductWishlistController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!userId)
      return res.status(400).json({ success: false, message: "User ID missing" });

    const { pId } = req.params;
    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: pId } },
        { new: true }
      )
      .populate("wishlist");

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ success: false, message: "Error adding to wishlist", error: error.message });
  }
};

// ====================== REMOVE PRODUCT FROM WISHLIST ======================
export const removeProductWishlistController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { pId } = req.params;

    const user = await userModel
      .findByIdAndUpdate(userId, { $pull: { wishlist: pId } }, { new: true })
      .populate("wishlist");

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing wishlist item", error });
  }
};

// ====================== GET WISHLIST PRODUCTS ======================
export const getWishlistProductController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!userId)
      return res.status(400).json({ success: false, message: "No user found" });

    const user = await userModel.findById(userId).populate("wishlist");
    res.json({
      success: true,
      wishlist: user.wishlist,
      countOfWishlistItems: user.wishlist.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching wishlist", error });
  }
};
