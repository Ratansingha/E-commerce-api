const express = require("express");

const runValidation = require("../validators");

const { isLoggedIn, isAdmin } = require("../middleware/auth");

const { handleCreateProduct, handleGetProduct, handleDeleteProduct, handleGetSingleProduct, handleUpdateProduct } = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const { uploadProductImg } = require("../middleware/uploadFile");

const productRouter= express.Router();


productRouter.post("/",uploadProductImg.single("image"),
validateProduct,
runValidation,
isLoggedIn,
isAdmin,
handleCreateProduct);

productRouter.get("/",handleGetProduct)

productRouter.get("/:slug", handleGetSingleProduct);

productRouter.delete("/:slug", isLoggedIn,isAdmin,handleDeleteProduct)

productRouter.put("/:slug",uploadProductImg.single("image") ,handleUpdateProduct)







module.exports= productRouter;