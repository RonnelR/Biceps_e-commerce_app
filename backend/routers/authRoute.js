import express from "express";
import {registerController , loginController ,testController, forgetPasswordController, profleUpdateController, newPasswordController } from "../controllers/authController.js";
import {isAdmin, isSignInRequired} from "../middlewares/authMiddleware.js";

//Route object
const router = express.Router();
 
//POST reigister
router.post('/register',registerController);

//POST login
router.post('/login', loginController);

//POST forget-password
router.post('/forget-password',forgetPasswordController)

//PUT new-password
router.put('/new-password',newPasswordController)

//GET test
router.get('/test', isSignInRequired ,isAdmin , testController );

//GET user-required
router.get('/user-required', isSignInRequired , (req,res)=>{res.status(200).send({ok:true})})

//GET admin
router.get('/admin-required',isSignInRequired , isAdmin ,(req,res)=>{
    res.status(200).send({
        ok:true,
        message:'Admin pages...!!'
    })
})

//put for profile Updation
 router.put('/profile', isSignInRequired, profleUpdateController)

export default router;