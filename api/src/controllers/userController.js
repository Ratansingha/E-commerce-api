const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { successResponse } = require("./responseController");
const User = require("../models/userModel"); 
const { findWithId } = require("../services/findItem");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientUrl, resetPassword } = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const sendEmail = require("../helper/sendEmail");
const { handleUserAction, findUser, findUserById, updateUsers, updateUserPassword, forgetUserPassword, resetUserPassword, deleteUserById} = require("../services/userService");
const cloudinary = require("../config/cloudinary");



const getUser= async(req,res,next)=>{
   try {
    const search = req.query.search || "";
    const page= Number(req.query.page)|| 1;
       const limit = Number(req.query.limit) || 5;
       
       const{ users,pagination} = await findUser(search, limit, page);

       return successResponse(res, {
           statusCode: 200,
           success: true,
           message: "user were returned",
           payload: {
               users: users,
               pagination: pagination,
           },
       });
   } catch (error) {
    next(error)
   }
};

//Get single user
const getSingleUser = async (req,res,next)=>{
 try {
     const id = req.params.id.trim();
     options={password:0}
 const user =  await findUserById(id,options)
    return successResponse(res,{
        statusCode:200,
        success:true,
        message:"user are returned",
        payload:{user}
    })
 } catch (error) {
    next(error)
 }
};

//Delete single user
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id.trim();
        const options = { password: 0 };

      await deleteUserById(id, options);

        return successResponse(res, {
            statusCode: 200,
            success: true,
            message: "user are deleted successfully"
        });
        
    } catch (error) {
        next(error)
    };
};

//Register process 
const registerProcess = async (req,res,next)=>{
try {
const {name,email,password,phone,address} = req.body;

const image =req.file?.path;
if(image && image.size > 1024*1024*2){
throw createError(400,"file Too large, it's must be less than 2mb")
    };

//this code for buffer string image file
// const imageBufferString = req.file.buffer.toString('base64');


//User exists check
const userExists = await User.exists({email:email});

if(userExists){
throw createError(409,"User with this email already , please sign in ")
    };
    const tokenPayload = { name, email, password, phone, address }
    if (image) {
        tokenPayload.image = image;
    }

const token = createJsonWebToken(tokenPayload,jwtActivationKey,"10m");


//Prepare email
const emailData = {
    email:email,
    subject:"Account activation mail",
    html:`
<h2>Hello ${name} ! </h2>    
<p>please click here to 
<a href="${clientUrl}/api/user/activate/${token}" target="_blank" >
activate your account
</a>
</p>
`
}; 

//Send email here 
    // sendEmail(emailData);
    
// try {
//     await emailWithNodeMailer(emailData)
// } catch (error) {
//     next(createError(500,"failed to send verification email"));
//     return;
// }

    return successResponse(res,{
        statusCode:200,
        success:true,
        message:`please go to your email: ${email}  for completing register process`,
        payload:token , 
    });

} catch (error) {
    next(error)
}
};
//New user account activate
const activateUserAccount = async (req, res, next) => {
    try {

        const token = req.body.token;
        if (!token) throw createError(404, "token not found");

        try {
            const decoded = jwt.verify(token, jwtActivationKey);

            if (!decoded) throw createError(404, "user was not verified")

            const userExists = await User.exists({ email: decoded.email });
            if (userExists) {
                throw createError(409, "User with this email already exists")
            }
            const image = decoded.image;
            if (image) {
                const response = await cloudinary.uploader.upload(image, {
                    folder:"ecommerceMern/users"
                });
                decoded.image = response.secure_url;
            };

            await User.create(decoded)

            return successResponse(res, {
                statusCode: 201,
                success: true,
                message: "user was register successfully",
                payload: {},
            });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw createError(401, "Token has expired")
            } else if (error.name === "jsonWebTokenError") {
                throw createError(401, "Invalid Token")
            } else {
                throw error
            }
        }
    
    } catch (error) {
        next(error)
    }
};

const updateUserById = async (req,res,next)=>{
    try {
      const userId = req.params.id.trim();
        const updatedUser = await updateUsers(userId,req);

       return successResponse(res,{
           statusCode:200,
           success:true,
           message:"user are updated successfully", 
           payload:{updatedUser} 
       });
    } catch (error) {
       next(error)
    }
};
   

const handleManageUserStatusById =async (req,res,next)=>{
    try {
  const userId = req.params.id.trim();
        const action = req.body.action;
        const successMessage = await handleUserAction(userId, action);
        return successResponse(res,{
            statusCode:200,
            success:true,
            message:successMessage,  
        });   
    } catch (error) {
       next(error) 
    }
};
   

const handleUpdatePassword = async (req, res, next) => {
    try {
        const {email, oldPassword, newPassword ,confirmPassword} = req.body;
        const userId = req.params.id.trim();


        const updatePassword = updateUserPassword(userId, email, oldPassword, newPassword, confirmPassword);

        return successResponse(res, {
            statusCode: 200,
            success: true,
            message: "user password was updated successfully",
            payload: { updatePassword }
            
        });
    } catch (error) {
        next(error)
    }
};

const handleForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const token = await forgetUserPassword(email)

        //success response here
        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} tp reset the password`,
            payload: token,
            
        });         
    } catch (error) {
        next(error)
    }
};
  
const handleResetPassword = async (req, res, next) => {
    try {

        const { token, password } = req.body;

        await resetUserPassword(token, password);
        
        return successResponse(res, {
            statusCode: 200,
            message: "password reset successfully",
            
        });
    } catch (error) {
        next(error)
    }
};

module.exports= {getUser,getSingleUser,deleteUser,registerProcess,activateUserAccount, updateUserById,handleManageUserStatusById,handleUpdatePassword,handleForgetPassword,handleResetPassword}; 