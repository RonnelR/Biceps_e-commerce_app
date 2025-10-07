import express from "express";
import { allCategoryController, createCategoryController, deleteCategoyController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import { isAdmin, isSignInRequired } from "../middlewares/authMiddleware.js";

const router = express.Router();

//post route for create-category
router.post('/create-category' , isSignInRequired, isAdmin ,createCategoryController);

//put route for update-category
router.put('/update-category/:id' , isSignInRequired , isAdmin , updateCategoryController);

//get route for all category
router.get('/all-category', allCategoryController);

//get route for single category
router.get('/single-category/:id', singleCategoryController)

//delete route
router.delete('/delete-category/:id',isSignInRequired,isAdmin, deleteCategoyController)

export default router;