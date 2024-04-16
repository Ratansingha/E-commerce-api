const data = require("../data");
const Product = require("../models/productModel");
const User = require("../models/userModel")



// Product seeding process
const seedProducts= async(req,res,next)=>{
try {
    //deleting all user 
    await Product.deleteMany();

    //inserting new users
   const Products =  await Product.insertMany(data.products);
   
   return res.status(200).json(Products)
} catch (error) {
    next(error);
}
};


//User seeding process
const seedUser= async(req,res,next)=>{
try {
    //deleting all user 
    await User.deleteMany();

    //inserting new users
   const user =  await User.insertMany(data.users)
   return res.status(200).json(user)
} catch (error) {
    next(error);
}
};


module.exports= {seedUser,seedProducts}