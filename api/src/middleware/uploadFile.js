const multer = require("multer");
const { allowedFileType, maxFileSize, uploadUserImage, uploadProductImage } = require("../config");
require("dotenv").config();
 
//This code for disk storage//user

const userStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, uploadUserImage)
  // },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
});

//This code for disk storage//product

const productStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, uploadProductImage)
  // },
    
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
});

//this code for disk storage

const fileFilter = (req,file,cb)=>{
if(!allowedFileType.includes(file.mimetype)){
   return cb(new Error("file type not allowed"),false )
}
cb(null,true)
};

//this is for user Image
const uploadUserImg = multer({
  storage: userStorage,
  limits: { fileSize: maxFileSize },
  fileFilter: fileFilter,
});

//this file for product image
const uploadProductImg = multer({
  storage: productStorage,
  limits: { fileSize: maxFileSize },
  fileFilter: fileFilter,
});

 

//This code for memory storage
// const storage = multer.memoryStorage()


//This code for memory storage

// const fileFilter = (req,file,cb)=>{
//   if(!file.mimetype.startsWith("image/")){
// return cb(new Error("Only image file are allowed"),false)
//   };

//   if(file.size > maxFileSize){
//     return cb(new Error("file size exceed the maximum limit"),false)
//   };

//   if(!allowedFileType.includes(file.mimetype)){

//   return cb(new Error("File type is not allowed"),false);
//   };

// return cb(null,true)
// }

// const uploadUserImg = multer({
//     storage: userStorage,
//     limits:{fileSize:maxFileSize},
//     fileFilter: fileFilter,
// })


 module.exports = {uploadUserImg,uploadProductImg};