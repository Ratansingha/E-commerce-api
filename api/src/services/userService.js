const createError = require("http-errors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { findWithId } = require("./findItem");
const { deleteImage } = require("../helper/deleteImage");
const sendEmail = require("../helper/sendEmail");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { resetPassword, clientUrl } = require("../secret");
const cloudinary = require("../config/cloudinary");
const { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary } = require("../helper/cloudinaryHelper");

const findUser = async (search,limit,page) => {
    try {
           const searchRegExp = new RegExp('.*'+ search + '.*',"i");

        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ]
        };

        const options = { password: 0 };
        const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit);
        const count = await User.find(filter).countDocuments();

if(!users || users.length === 0){
    throw createError(404,"user not found")
        };
        return {
            users,
            pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
            },
        };
    } catch (error) {
        throw error;
    }
};

const findUserById = async (id,options={}) => {
    try {
        const user = await User.findById(id, options);

    if (!user){
        throw createError(404,"user not found with this id")
        }
        return user;

    } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
            throw createError(400,"Invalid id...")
        }
    }
}

const deleteUserById = async (id) => {
    try {
        const existingUser = await User.findOne({
            _id: id,
        });

        if (existingUser && existingUser.image) {
            const publicId = await publicIdWithoutExtensionFromUrl(existingUser.image);  
            await deleteFileFromCloudinary("ecommerceMern/user", publicId, "User");
        };
        
        await User.findByIdAndDelete({
            _id: id,
            isAdmin:false,
         });

        // if (user && user.image) {
        //     await deleteImage(user.image)
        // };

    } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
            throw createError(400,"Invalid id...")
        }
    };
};

const updateUsers = async (userId,req) => {
    try {
        const options = { password: 0 };

      const user =  await findUserById(userId,options);

      const updateOptions= {new:true,runValidation:true,context:"query"};

      let updates= {}
      const allowedFields = ["name","password","address","phone"]
for(const key in req.body){
    if(allowedFields.includes(key)){
        updates[key] = req.body[key]
    } else if(key === "email"){
        throw  createError(400,"Email can't be  updated")
    }
}
    
  const image = req.file?.path;
  if(image){
    if(image.size > 1024*1024*2){
          throw createError(400, "file Too large, it's must be less than 2mb")
      };
        }
        updates.image = image;
        user.image !== "default.jpeg" && deleteImage(user.image)

   const updatedUser = await User.findByIdAndUpdate(userId,updates,updateOptions).select("-password");

   if(!updatedUser){
    throw createError(404,"user with this id doesn't exists")}
        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400,"Invalid id...")
        }
    };
};
const updateUserPassword = async (userId,oldPassword,newPassword,confirmPassword) => {
    try {
       
        const user = await User.findOne({ email: email });

        if (!user) {
            throw createError(404,"User not found with this email...!")
        };
        
        //password matched
        if (newPassword !==confirmPassword) {
            throw createError(400,"newPassword and confirmPassword not matched")
        };

             //compare with password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            throw createError(400, "old password is incorrect");
        };
        
        const updatePassword = await User.findByIdAndUpdate(
            userId,
            { password: newPassword },
            { new: true }
        ).select("-password");

        if (!updatePassword) {
            throw createError(400, "User Password not updated successfully")
        };

        return updatePassword;

    } catch (error) {
         if (error instanceof mongoose.Error.CastError) {
            throw createError(400,"Invalid id...")
        } 
    }
};
const forgetUserPassword = async (email) => {
    try {
       const userData = await User.findOne({ email: email });

        if (!userData) {
            throw createError(404, "Email is incorrect or your have not verified your email address. Please register yourself first ")
        };

        const token = createJsonWebToken({ email }, resetPassword, "10m");


        //Prepare email
        const emailData = {
            email: email,
            subject: "Password Reset Email",
            html: `
            <h2> Hello ${userData.name} ! <h2>  

           <p>please click here to 
           <a href="${clientUrl}/api/user/resetPassword/${token}" target="_blank" >
           Reset your password
          </a>
          </p>
                `
        };

        //Send email here 
        sendEmail(emailData);

        return token;
    } catch (error) {
        throw error;
    }
};

const resetUserPassword = async (token,password) => {
    try {
       const decoded = jwt.verify(token, resetPassword);
        if (!decoded) {
            throw createError(400, "Invalid or expired token")
        }
        const filter = { email: decoded.email };
        const update = { password: password };
        const options = { new: true }

        const updatedPassword = await User.findOneAndUpdate(filter, update, options
        );

        if (!updatedPassword) {
            throw createError(400, "password reset failed")
        };
    } catch (error) {
        throw error;
    }
};

const handleUserAction = async (action, userId) => {
    try {
        let update;
        let successMessage;
        if (action === "ban") {
            update = { isBanned: true }
            successMessage = "User was ban successfully"
        } else if (action === "unBanned") {
            update = { isBanned: false }
            successMessage = "User was unBanned successfully"
        } else {
            throw createError(400, 'Invalid Action. use "ban" or "unBanned');
        }

        const updateOptions = { new: true, runValidation: true, context: "query" }

        const updatedUser = await User.findByIdAndUpdate(
            userId, update, updateOptions
        ).select("-password");
        if (!updatedUser) {
            createError(400, "user was not banned successfully");
        }
        return successMessage;
    } catch (error) {
             if (error instanceof mongoose.Error.CastError) {
            throw createError(400,"Invalid id...")
        }
    }
    
};



module.exports = {
    findUser,
    findUserById,
    deleteUserById,
    updateUsers,
    updateUserPassword,
    forgetUserPassword,
    resetUserPassword,
    handleUserAction
};