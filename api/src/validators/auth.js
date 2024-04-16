const {body} = require("express-validator")

//registration validation 
 const validateUserRegistration= [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your User name")
    .isLength({min:3,max:31})
    .withMessage("Name should be at least 3-31 characters long"),

    body('email')
    .trim()
    .notEmpty()
    .withMessage("email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email address"),

    body('password')
    .trim()
    .notEmpty()
    .withMessage("password is required. Enter your password")
    .isLength({min:6})
    .withMessage("password should be at least 6 characters long")
    .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/
        )
   .withMessage("Password should contain at least one uppercase letter, one lowercase letter, one number,and one special character"),

    body('address')
    .trim()
    .notEmpty()
    .withMessage("address is required. Enter your Address")
    .isLength({min:3})
    .withMessage("address should be at least 3 characters long"),
   
    body('phone')
    .trim()
    .notEmpty()
       .withMessage("phone number  is required. Enter your phone Number"),
    
    body("image")
       .optional()
       .isString()
       .withMessage("user image is optional"),

   //  body('image')
   //  .custom((value,{req})=>{
   //    if(!req.file || !req.file.buffer){
   // throw new Error("User image is required")
   //    }
   //    return true;
   //  })
       
   //  .withMessage("User image is required"),

 ];

const validateUserLogIn = [
   body('email')
   .trim()
   .notEmpty()
   .withMessage("email is required. Enter your email address")
   .isEmail()
   .withMessage("Invalid email address"),

   body('password')
    .trim()
    .notEmpty()
    .withMessage("password is required. Enter your password")
    .isLength({min:6})
    .withMessage("password should be at least 6 characters long")
    .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/
        )
   .withMessage("Password should contain at least one uppercase letter, one lowercase letter, one number,and one special character"),

]
const validateUserPasswordUpdate = [
 
   body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage("oldPassword is required. Enter your oldPassword")
    .isLength({min:6})
    .withMessage("oldPassword should be at least 6 characters long")
    .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/
        )
   .withMessage("Password should contain at least one uppercase letter, one lowercase letter, one number,and one special character"),

   body('newPassword')
    .trim()
    .notEmpty()
    .withMessage("newPassword is required. Enter your newPassword")
    .isLength({min:6})
    .withMessage("newPassword should be at least 6 characters long")
    .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/
        )
   .withMessage("Password should contain at least one uppercase letter, one lowercase letter, one number,and one special character"),

   body("confirmedPassword").custom((value,{req})=>{

if(value !== req.body.newPassword){
   throw new Error("Password did not match");
}
return true;
   })

]

const validateUserForgetPassword = [
   body('email')
   .trim()
   .notEmpty()
   .withMessage("email is required. Enter your email address")
   .isEmail()
   .withMessage("Invalid email address"),
  
]

const validateUserResetPassword = [
   body('token')
   .trim()
   .notEmpty()
   .withMessage("token is missing")
,

 body('password')
 .trim()
 .notEmpty()
 .withMessage("password is required. Enter your password")
 .isLength({min:6})
 .withMessage("password should be at least 6 characters long")
 .matches(
     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/
     )
.withMessage("Password should contain at least one uppercase letter, one lowercase letter, one number,and one special character"),
  
]


 module.exports = {validateUserRegistration ,validateUserLogIn ,validateUserPasswordUpdate,validateUserForgetPassword,validateUserResetPassword}