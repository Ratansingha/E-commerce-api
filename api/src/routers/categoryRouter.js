const express = require("express");
const runValidation = require("../validators");

const { isLoggedIn, isAdmin } = require("../middleware/auth");
const { handleCreateCategory, handleGetCategory, handleGetSingleCategory, handleUpdateCategory, handleDeleteCategory } = require("../controllers/categoryController");

const { validateCategory } = require("../validators/category");
const categoryRouter= express.Router()




categoryRouter.post("/",validateCategory, runValidation, handleCreateCategory);
  
categoryRouter.get("/", handleGetCategory);

categoryRouter.get("/:slug", handleGetSingleCategory);
categoryRouter.put("/:slug", handleUpdateCategory);
categoryRouter.delete("/:slug", handleDeleteCategory);



 










module.exports= categoryRouter;