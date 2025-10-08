import express from 'express';
import {BraintreePaymentController, BraintreeTokenController, addProdToWishlistController, allOrdersController, allProductController, createProductController, deleteProdFromWishlistController, deleteProductController, getWishlistController, orderListController, productCountController, productFilterCotroller, productListController, productPhotoController, productsBasedOnCategoryController, relatedProductController, searchProductController, singleProductController, updateOrdersController, updateProductController } from '../controllers/productControllers.js';
import { isAdmin, isSignInRequired } from '../middlewares/authMiddleware.js';
import formidableMiddleware from 'express-formidable';

//router api
const router = express.Router();

//create-product route

router.post('/create-product',isSignInRequired, isAdmin,formidableMiddleware(),  createProductController);

//put route for update-product
router.put('/update-product/:id' , isSignInRequired , isAdmin ,formidableMiddleware(), updateProductController);

//get route for all product
router.get('/all-product', allProductController);

//get route for photo
router.get('/product-photo/:id', productPhotoController);

//get route for single product
router.get('/single-product/:slug', singleProductController)

//delete route
router.delete('/delete-product/:id',isSignInRequired,isAdmin, deleteProductController)

//product filter
router.post('/product-filter',productFilterCotroller);

//total product count
router.get('/product-count', productCountController);

//product list
router.get('/product-list/:page', productListController)
export default router;

//product search
router.get('/search-product/:keyword', searchProductController)

//similar products 
router.get('/relared-products/:pid/:cid', relatedProductController)

//products based on categories
router.get('/products-category/:slug', productsBasedOnCategoryController)

//payment routes
//payment token
router.get('/braintree/token', BraintreeTokenController);

//paymennt 
router.post('/braintree/payment', isSignInRequired , BraintreePaymentController)

//order lists
router.get('/order-lists' ,isSignInRequired, orderListController)

//allOrders
router.get('/all-orders' ,isSignInRequired , isAdmin , allOrdersController)

//update orders
router.put('/update-orders/:orderId' ,isSignInRequired ,isAdmin , updateOrdersController )

//wishlist get 
router.get('/wishlist/get-List' ,isSignInRequired, getWishlistController)

//add wishlist items
router.put('/wishlist/add-Products',isSignInRequired, addProdToWishlistController)

//remove product from wishlist
router.put('/wishlist/remove-Products',isSignInRequired, deleteProdFromWishlistController)
