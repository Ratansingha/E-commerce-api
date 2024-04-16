const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createProduct, deleteProduct, updateProduct} = require("../services/productService");
const Product = require("../models/productModel");
const slugify = require("slugify");


//Create product
const handleCreateProduct = async(req,res,next)=>{
try {
    const image = req.file?.path;
    
    const product = await createProduct(req.body,image );
  
//success response
 return successResponse(res,{
    statusCode:200,
    message:"Product was created successfully",
    payload:{product}
 })

} catch (error) {
    next(error)
}
};


//Get Product
const handleGetProduct = async(req,res,next)=>{
try {
    const search = req.query.search || ""; 
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit )|| 2;

   const searchRegExp = new RegExp('.*'+ search + '.*',"i");

   const filter = {
    $or:[
        {name: { $regex: searchRegExp}}, 
    ]
}

const products = await Product.find(filter)
.populate('category')
.skip((page-1)*limit)
.limit(limit)
.sort({createdAt: -1});
 if(!products){
    throw createError(404,"product not found!")
 }
const count = await Product.find({}).countDocuments();
  
//success response
 return successResponse(res,{
    statusCode:200,
    message:"Returned all the product",
    payload:{
        products:products,
        pagination:{
            totalPages:Math.ceil(count/limit),
            currentPage: page,
            previousPage: page-1,
            nextPage:page + 1,
            totalProduct: count,
        }
    },
 })

} catch (error) {
    next(error)
}
};

const handleGetSingleProduct = async(req,res,next)=>{
try {
 
 const {slug} = req.params; 
const products = await Product.findOne({slug}).populate("category");
  
//success response
 return successResponse(res,{
    statusCode:200,
    message:"Returned single product", 
    payload:{products}
 })

} catch (error) {
    next(error)
}
};


const handleDeleteProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
   
        await deleteProduct(slug);
  
        //success response
        return successResponse(res, {
            statusCode: 200,
            message: "Product had been deleted"
        });

    } catch (error) {
        next(error)
    }
};

//Update product
const handleUpdateProduct = async (req, res, next) => {
    try {
     
        const { slug } = req.params;

        const updatedProduct = await updateProduct(slug,req);

        return successResponse(res, {
            statusCode: 200,
            success: true,
            message: "Product are updated successfully",
            payload: { updatedProduct }
        });
    } catch (error) {
        next(error)
    }
};



module.exports = {handleCreateProduct,handleGetProduct,handleGetSingleProduct,handleDeleteProduct,handleUpdateProduct}