import productModel from "../models/productModel.js";
import categoryModel from '../models/categoryModel.js';
import slugify from "slugify";
import fs from 'fs';
import braintree from "braintree";
import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js";
import wishlistModel from "../models/wishlistModel.js";

dotenv.config();

// ================= Payment Gateway ===================
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID, // Your Braintree merchant ID
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// ================= Product Controllers ===================

// Create Product
export const createProductController = async(req,res)=>{
    try {
        const {name,slug,description,shipping,price,category,quantity} = req.fields;
        const {photo} = req.files;

        // Validation
        switch(true){
            case !name: return res.status(500).send({error:"name required!"});
            case !description: return res.status(500).send({error:"description required!"});
            case !shipping: return res.status(500).send({error:"shipping required!"});
            case !price: return res.status(500).send({error:"price required!"});
            case !category: return res.status(500).send({error:"category required!"});
            case !quantity: return res.status(500).send({error:"quantity required!"});
            case photo && photo.size > 1000000: return res.status(401).send({error:"photo required and should be below 1 MB!"});
        }

        const createProd = new productModel({...req.fields, slug:slugify(name)});
        if(photo){
            createProd.photo.data = fs.readFileSync(photo.path);
            createProd.photo.contentType = photo.type;
        }
        await createProd.save();

        res.status(200).send({
            success:true,
            message:'Product created!',
            createProd
        });

    } catch (error) {
        console.log(error);
        res.status(501).send({
            success:false,
            message:'Error in creating product!',
            error
        });
    }
}

// Update Product
export const updateProductController = async(req,res)=>{
    try {
        const {name,slug,description,shipping,price,category,quantity} = req.fields;
        const {photo} = req.files;
        const {id} = req.params;

        switch(true){
            case !name: return res.status(500).send({error:"name required!"});
            case !description: return res.status(500).send({error:"description required!"});
            case !shipping: return res.status(500).send({error:"shipping required!"});
            case !price: return res.status(500).send({error:"price required!"});
            case !category: return res.status(500).send({error:"category required!"});
            case !quantity: return res.status(500).send({error:"quantity required!"});
            case photo && photo.size > 1000000: return res.status(500).send({error:"photo should be below 1 MB!"});
        }

        const update = await productModel.findByIdAndUpdate(id,{...req.fields, slug:slugify(name)},{new:true});
        if(photo){
            update.photo.data = fs.readFileSync(photo.path);
            update.photo.contentType = photo.type;
        }
        await update.save();

        res.status(200).send({
            success:true,
            message:'Product updated!',
            update
        });

    } catch (error) {
        console.log(error);
        res.status(501).send({
            success:false,
            message:'Error in update-product',
            error
        });
    }
}

// All Products
export const allProductController = async(req,res)=>{
    try {
        const allProduct = await productModel.find({}).select("-photo").sort({createdAt:-1});
        res.status(200).send({
            success:true,
            noOfProducts:allProduct.length,
            message:'All products',
            allProduct
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({success:false, message:'Error in all products'});
    }
}

// Single Product
export const singleProductController = async(req,res)=>{
    try {
        const singleProd = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        if(!singleProd) return res.send({message:'No such product!'});

        res.status(200).send({success:true, message:'Single product', singleProd});
    } catch (error) {
        console.log(error);
        res.status(400).send({success:false, message:'Error in single product', error});
    }
}

// Product Photo
export const productPhotoController = async(req,res)=>{
    try {
        const getPhoto = await productModel.findById(req.params.id).select("photo");
        if(getPhoto.photo.data){
            res.set("Content-type",getPhoto.photo.contentType);
            return res.status(200).send(getPhoto.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({success:false, message:'Error showing photo', error});
    }
}

// Delete Product
export const deleteProductController = async(req,res)=>{
    try {
        const {id} = req.params;
        await productModel.findByIdAndDelete(id);
        res.status(200).send({success:true, message:'Product deleted!'});
    } catch (error) {
        console.log(error);
        res.status(502).send({success:false, message:'Error in deleting product'});
    }
}

// Product Filter
export const productFilterCotroller = async(req,res)=>{
    try {
        const {checked,radio} = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const product = await productModel.find(args);
        res.status(200).send({success:true, message:'Filtered products', product});
    } catch (error) {
        res.status(500).send({success:false, message:"Error in product filter", error});
    }
}

// Product Count
export const productCountController = async(req,res)=>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({success:true, message:'Total product count', total});
    } catch (error) {
        console.log(error);
        res.status(401).send({success:false, message:'Error in product count', error});
    }
}

// Product List (Pagination)
export const productListController = async(req,res)=>{
    try {
        const perPage = 4;
        const page = req.params.page ? req.params.page : 1;
        const product = await productModel.find({})
            .select("-photo")
            .skip((page-1)*perPage)
            .limit(perPage)
            .sort({createdAt:-1});

        res.status(200).send({success:true, message:'Product pages', product});
    } catch (error) {
        res.status(501).send({success:false, message:'Error in product list'});
    }
}

// Search Product
export const searchProductController = async(req,res)=>{
    try {
        const {keyword} = req.params;
        const result = await productModel.find({
            $or:[
                {name: {$regex: keyword , $options:'i'}},
                {description: {$regex: keyword , $options:'i'}}
            ]
        }).select('-photo');
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send({success:false, message:'Error in searching', error});
    }
}

// Related Products
export const relatedProductController = async(req,res)=>{
    try {
        const {pid,cid} = req.params;
        const product = await productModel.find({category: cid, _id: {$ne: pid}})
            .select('-photo')
            .limit(3)
            .populate('category');
        res.status(200).send({success:true, message:'Related products', product});
    } catch (error) {
        res.status(400).send({success:false, message:'Error in related product'});
    }
}

// Products Based on Category
export const productsBasedOnCategoryController = async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug: req.params.slug});
        const products = await productModel.find({category}).select('-photo').populate('category');
        res.status(200).send({success:true, message:'Products by category', category, products});
    } catch (error) {
        res.status(400).send({success:false, message:'Error in products based on category'});
    }
}

// ================= Braintree Controllers ===================

// Braintree Token
export const BraintreeTokenController = async(req,res)=>{
    try {
        gateway.clientToken.generate(
            { merchantAccountId: 'biceps' }, // <-- PayPal-linked sandbox merchant account
            function(err,response){
                if(err){
                    console.log('Braintree Token Error:', err);
                    return res.status(500).send({success:false, error: err});
                } else {
                    res.send({success:true, clientToken: response.clientToken});
                }
            }
        );
    } catch (error) {
        console.log('Braintree Token Catch Error:', error);
        res.status(500).send({success:false, error});
    }
}

// Braintree Payment
export const BraintreePaymentController = async(req,res)=>{
    try {
        const {cart, nonce} = req.body;
        let total = 0;
        cart?.forEach(i => total += i.price);

        gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            merchantAccountId: 'biceps', // <-- PayPal-linked account
            options: { submitForSettlement: true }
        }, function(error,result){
            if(result){
                new orderModel({
                    payment: result,
                    products: cart,
                    buyers: req?.user?._id
                }).save();
                res.json({ok:true});
            } else {
                console.log('Payment Error:', error);
                res.status(500).send({message:'Something went wrong in payment', error});
            }
        });

    } catch (error) {
        console.log('Braintree Payment Catch Error:', error);
        res.status(500).send({success:false, error});
    }
}

// ================= Order Controllers ===================

// Order List (User)
export const orderListController = async(req,res)=>{
    try {
        const order = await orderModel.find({buyers:req.user._id})
            .populate("products","-photo")
            .populate("buyers","name");
        res.status(200).json(order);
    } catch (error) {
        res.status(500).send('Error in showing order list');
    }
}

// All Orders (Admin)
export const allOrdersController = async(req,res)=>{
    try {
        const getAllOrders = await orderModel.find({})
            .populate("products","-photo")
            .populate("buyers","name");
        res.status(201).json(getAllOrders);
    } catch (error) {
        res.status(500).send({success:false, message:'Error in all Orders!', error});
    }
}

// Update Orders
export const updateOrdersController = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const order = await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
        res.json(order);
    } catch (error) {
        res.status(500).send({success:false, message:'Error in updating orders', error});
    }
}

// ================= Wishlist Controllers ===================

// Get Wishlist
export const getWishlistController = async(req,res)=>{
    try {
        const items = await wishlistModel.find({user:req.user._id})
            .select('wishlistItems')
            .populate('wishlistItems','-photo');
        res.status(200).send({success:true, totalWishlistProducts: items.length, message:'Wishlist products', items});
    } catch (error) {
        res.status(402).send({success:false, message:'Error in Wishlist'});
    }
}

// Add / Remove Product in Wishlist
export const addProdToWishlistController = async(req,res)=>{
    const {pid} = req.body;
    const {_id} = req.user;
    try {
        const checkProd = await wishlistModel.find({wishlistItems:pid});
        if(checkProd.length === 0){
            const addProd = await wishlistModel.findOneAndUpdate({user:_id},{$push:{wishlistItems:pid}},{new:true});
            res.json({success:true, message:'Product added to wishlist', addProd});
        } else {
            const addProd = await wishlistModel.findOneAndUpdate({user:_id},{$pull:{wishlistItems:pid}},{new:true});
            res.json({success:true, message:'Product removed from wishlist', addProd});
        }
    } catch (error) {
        res.status(400).send({success:false, message:'Error!', error});
    }
}

// Delete Product from Wishlist
export const deleteProdFromWishlistController = async(req,res)=>{
    const {pid} = req.body;
    const {_id} = req.user;
    try {
        const deleteProduct = await wishlistModel.findOneAndUpdate({user:_id},{$pull:{wishlistItems:pid}},{new:true});
        res.json({success:true, message:'Product removed from wishlist', deleteProduct});
    } catch (error) {
        res.status(402).send({success:false, message:'Error in deleting product from wishlist'});
    }
}
