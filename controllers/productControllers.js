import productModel from "../models/productModel.js";
import categoryModel from '../models/categoryModel.js';
import slugify from "slugify";
import fs from 'fs';
import braintree from "braintree";
import dotenv from 'dotenv'
import orderModel from "../models/orderModel.js";

dotenv.config();


//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHAND_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
  

//create product
export const createProductController = async(req,res)=>{
try {
        const {name,slug,description,shipping,price,category,quantity} = req.fields;
        const {photo} = req.files;

        //validation
    switch(true){
        case !name:return res.status(500).send({
            error:"name required!"
        })
        case !description:return res.status(500).send({
            error:"description required!"
        })
        case !shipping:return res.status(500).send({
            error:"shiping required!"
        })
        case !price: return res.status(500).send({
            error:"price required!"
        })
        case !category:return res.status(500).send({
            error:"category required!"
        })
        case !quantity:return res.status(500).send({
            error:"quantity required!"
        })
        case photo && photo.size > 1000000 :return res.status(401).send({
            error:"photo required and it should be below 1 mb!"
        })
    }

    const createProd = new productModel({...req.fields,slug:slugify(name)})
    if(photo){
        createProd.photo.data = fs.readFileSync(photo.path);
        createProd.photo.contentType = photo.type
    }
    await createProd.save();



    res.status(200).send({
        success:true,
        message:'producted created!',
        createProd
    })

} catch (error) {
    console.log(error);
    res.status(501).send({
        success:false,
        message:'Error in creating product!',
        error
    })
}
}


//update-product 

export const updateProductController =async (req,res)=>{
    try {
        
        const {name,slug,description,shipping,price,category,quantity} = req.fields;
        const {photo} = req.files;
        const {id} = req.params

        switch(true){
            case !name:
                return res.status(500).send({
                error:"name required!"
            })
            case !description:return res.status(500).send({
                error:"description required!"
            })
            case !shipping:return res.status(500).send({
                error:"shiping required!"
            })
            case !price:return res.status(500).send({
                error:"price required!"
            })
            case !category:return res.status(500).send({
                error:"category required!"
            })
            case !quantity:return res.status(500).send({
                error:"quantity required!"
            })
            case photo && photo.size > 1000000 :
                return res.status(500).send({
                error:"photo required and it should be below 1 mb!"
            })
        }

      const update = await productModel.findByIdAndUpdate(id,{...req.fields, slug:slugify(name)},{new:true})
      if(photo){
        update.photo.data = fs.readFileSync(photo.path);
        update.photo.contentType = photo.type;
    }
     await update.save();
        res.status(200).send({
            success:true,
            message:'product updated!',
            update
        })

    } catch (error) {
        console.log(error);
        res.status(501).send({
            success:false,
            message:'Error in update-product',
            error
        })
    }
}


//all Products
export const allProductController = async(req,res)=>{
try {

    const allProduct = await productModel.find({}).select("-photo").sort("createdAt").limit(12)
    res.status(200).send({
        success:true,
        noOfProducts:allProduct.length,
        message:'all-products',
        allProduct
    })
    
} catch (error) {
    console.log(error);
    res.status(501).send({
        success:false,
        message:'Error in all product'
    })
}
}

//single product
export const singleProductController =async (req,res)=>{
    try {
        const singleProd = await productModel.findOne({slug:req.params.slug}).select("-photo")
        .populate("category");
        if(!singleProd){
            return res.send({
                message:'no such product!'
            })
        }

        res.status(200).send({
            success:true,
            message:'single product',
            singleProd
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error in single product',
            error
        })
    }
}

//product-photo
export const productPhotoController = async(req,res)=>{
    try {
        
        const getPhoto = await productModel.findById(req.params.id).select("photo")
        if(getPhoto.photo.data){
                res.set("Content-type",getPhoto.photo.contentType)
            return res.status(200).send(getPhoto.photo.data)
        }
       
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error in showig photo',
            error
        })
    }
}

//delete product
export const deleteProductController =async(req,res)=>{
try {
    
const {id}=req.params;

const deleteProd = await productModel.findByIdAndDelete(id)
res.status(200).send({
    success:true,
    message:'product Deleted!'
})

} catch (error) {
    console.log(error);
    res.status(502).send({
        success:false,
        message:'Error in deleting product'
    })
}
}

//product filter controller
export const productFilterCotroller = async(req,res) =>{
try {
    const {checked,radio} = req.body;
    let args={}
    if(checked.length > 0 ) args.category = checked;
    if(radio.length) args.price = {$gte : radio[0],$lte : radio[1] }
    const product = await productModel.find(args)
    res.status(200).send({
        success:true,
        message:'filter products',
        product
    }
       
    )
} catch (error) {
    res.status(500).send({
        success:false,
        message:"error in product filter",
        error
    })
}
}


//product count
export const productCountController = async(req,res) =>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            message:'total product count',
            total
        })
    } catch (error) {
        res.status(401).send({
            success:false,
            message:'Error in product count page',
            error
        })
        console.log(error)

    }
}


//product list controller
export const productListController = async (req,res) =>{
    try {
        const perPage =3;
        const page = req.params.page ? req.params.page : 1 ;
        const product = await productModel.find({})
        .select("-photo")
        .skip((page-1)*perPage)
        .limit(perPage)
        .sort({createdAt:-1})

        res.status(200).send({
            success:true,
            message:'product pages..',
            product
        })
    } catch (error) {
        res.status(501).send({
            success:false,
            message:'Error in product list'
        })
    }
}


//search product 
export const searchProductController = async (req,res) =>{
    try {

        const {keyword} = req.params;

       const result = await productModel.find({
        $or:[
            {name: {$regex: keyword , $options:'i'}},
            {description: {$regex: keyword , $options:'i'}}
        ]
       }).select('-photo')
       res.json(result).status(200)
     
        
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in searching',
            error
        })
    }
}


//related product controller
export const relatedProductController = async (req,res) =>{
    try {
        const {pid,cid} = req.params

        const product  = await productModel.find({
           category:cid,
           _id:{$ne:pid}
        }).select('-photo').limit(3).populate('category')

        res.status(200).send({
            success:true,
            message:'related product successfull',
            product
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'Error in related product'
        })
    }
   
}


//products Based On CategoryController
export const productsBasedOnCategoryController = async (req,res) =>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        const products = await productModel.find({category}).select('-photo').populate('category')

        res.status(200).send({
            success:true,
            message:'productsBasedOnCategoryController is successfull',
            category,
            products
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in productsBasedOnCategoryController'
        })
    }
}


//braintree token
export const BraintreeTokenController = async(req,res) =>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
            
        })
    } catch (error) {
     console.log(error)   
    }

}



//braintree Payment
export const BraintreePaymentController = async(req,res) =>{
    try {
    const {cart , nonce} = req.body;
        let total = 0;
        cart?.map((i)=>{total += i.price})

         gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement: true
            }
        },function(error,result){
            if(result){
                const newOrder = new orderModel({
                    payment:result,
                    products:cart,
                    buyers:req?.user?._id

                }).save();
                res.json({ok:true})
            }else{
                res.status(500).send({
                    message:'somethng went wrong in payment',
                    error
                })
            }
        })
     

    } catch (error) {
        console.log(error)
    }

}

//order list
export const orderListController = async (req,res)=>{
     try {
        const order = await orderModel.find({buyers:req.user._id}).populate("products","-photo").populate("buyers","name")
        res.status(200).json(order)
     } catch (error) {
        res.status(500).send('Error in showing order list')
     }
}

//all-orders
export const allOrdersController = async(req,res)=>{
    try {
        const getAllOrders = await orderModel.find({}).populate("products","-photo").populate("buyers","name")
        res.status(201).json(getAllOrders)
    } catch (error) {
        res.status(500).send({

            success:false,
            message:'Error in all Orders!',
            error
        })
    }
}

//update - orders
export const updateOrdersController = async (req,res) =>{
    try {
        const {orderId} = req.params
        const {status} = req.body
        const order = await orderModel.findByIdAndUpdate(orderId,{status} , {new:true})
        res.json(order)
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error in updating orders',
            error
        })
    }
}