const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seedController");
const { uploadUserImg, uploadProductImg } = require("../middleware/uploadFile");

const seedRouter= express.Router();

seedRouter.get("/users",uploadUserImg.single("image"), seedUser);
seedRouter.get("/products",uploadProductImg.single("image"),seedProducts);




module.exports= seedRouter;