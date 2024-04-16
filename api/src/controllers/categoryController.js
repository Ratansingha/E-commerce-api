const createError = require("http-errors");
const Category = require("../models/categoryModel");
const { createCategory, getCategory, singleCategory, updateCategory, deleteCategory } = require("../services/categoryService");
const { successResponse } = require("./responseController");



const handleCreateCategory = async(req,res,next)=>{
    try {
        const {name} = req.body;

    const newCategory  = await createCategory(name);

        //successResponse
        return successResponse(res,{
            statusCode:201,
            success:true,
            message:"Category was created successfully", 
            payload:newCategory,
        });

    } catch (error) {
        next(error)
    }
};

const handleGetCategory = async(req,res,next)=>{
    try {

const category = await getCategory();
        //successResponse
        return successResponse(res,{
            statusCode:200,
            success:true,
            message:"Category were returned  successfully", 
            payload:{category},
        });

    } catch (error) {
        next(error)
    }
};

const handleGetSingleCategory = async(req,res,next)=>{
    try {
const {slug}= req.params;
const categories = await singleCategory(slug);

        //successResponse
        return successResponse(res,{
            statusCode:200,
            success:true,
            message:"Category were returned  successfully", 
            payload:{categories},
        });

    } catch (error) {
        next(error)
    }
};

const handleUpdateCategory = async(req,res,next)=>{
    try {
const {name}= req.body;
const {slug}= req.params;
const update = await updateCategory(name,slug);
if(!update){
    throw createError(404,"Category not found With this slug")
}
        //successResponse
        return successResponse(res,{
            statusCode:200,
            success:true,
            message:"Category was updated successfully", 
            payload:{update},
        });

    } catch (error) {
        next(error)
    }
};
const handleDeleteCategory = async(req,res,next)=>{
    try {
const {slug}= req.params;
const result =  await deleteCategory(slug);
if(!result){
throw createError(404,"No Category found with this slug")
}
        //successResponse
        return successResponse(res,{
            statusCode:200,
            success:true,
            message:"Category was deleted successfully",            
        });

    } catch (error) {
        next(error)
    }
};



module.exports = {handleCreateCategory,handleGetCategory,handleGetSingleCategory,handleUpdateCategory,handleDeleteCategory}