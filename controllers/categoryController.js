import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';

//create-category
export const createCategoryController = async (req,res) => {
            try {
                
                const {name} = req.body;

                if(!name){
                     res.status(400).send({
                        message:'required name!'
                    });
                }

                const ExistedCategory = await categoryModel.findOne({name})

                if(ExistedCategory){
                    res.status(200).send({
                        success:false,
                        message:'is Already Existed',
                    });
                };
                
                const newCategory =await new categoryModel({name,slug:slugify(name)}).save();
                res.status(200).send({
                    success:true,
                    message:'is created!!',
                    newCategory
                });

            } catch (error) {
                console.log(error);
                res.status(500).send({
                    success:false,
                    message:'Error in catogry',
                    error
                })
            }
}

//update-category 

export const updateCategoryController =async (req,res)=>{
    try {
        
        const {name } = req.body;
        const {id} = req.params

      const update = await categoryModel.findByIdAndUpdate(id,{name:name,slug:slugify(name)});
        res.status(200).send({
            success:true,
            message:'category updated!',
            update
        })

    } catch (error) {
        console.log(error);
        res.status(501).send({
            success:false,
            message:'Error in update-category',
            error
        })
    }
}


//all category
export const allCategoryController = async(req,res)=>{
try {

    const allCategory = await categoryModel.find({})
    res.status(200).send({
        success:true,
        noOfCategories:allCategory.length,
        message:'all-category',
        allCategory
    })
    
} catch (error) {
    console.log(error);
    res.status(501).send({
        success:false,
        message:'Error in all category'
    })
}
}

//single category
export const singleCategoryController =async (req,res)=>{
    try {
        
        const {id}= req.params

        const singleCat = await categoryModel.findOne({_id:id})

        if(!singleCat){
            return res.send({           
                message:'no such category!'
            })
        }

        res.status(200).send({
            success:true,
            message:'single category',
            singleCat
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error in single category',
            error
        })
    }
}

//delete category
export const deleteCategoyController =async(req,res)=>{
try {
    
const {id}=req.params;

const deleteCat = await categoryModel.findByIdAndDelete(id)
res.status(200).send({
    success:true,
    message:'Category Deleted!'
})

} catch (error) {
    console.log(error);
    res.status(502).send({
        success:false,
        message:'Error in deleting category'
    })
}
}
