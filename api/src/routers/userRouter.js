const express = require("express");
const { getUser,
  getSingleUser,
  registerProcess,
  activateUserAccount,
  updateUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
  handleManageUserStatusById, 
  deleteUser
  } = require("../controllers/userController");

const {uploadUserImg} = require("../middleware/uploadFile");
const { validateUserRegistration, validateUserPasswordUpdate, validateUserResetPassword, validateUserForgetPassword } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middleware/auth");
const userRouter= express.Router()


userRouter.post("/register", 
 uploadUserImg.single("image"),
 validateUserRegistration,
 runValidation,
  registerProcess);

userRouter.post("/activate",activateUserAccount);
userRouter.get("/",isLoggedIn,isAdmin,getUser);

userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getSingleUser);

userRouter.delete("/:id", isLoggedIn, isAdmin,deleteUser);


userRouter.put("/reset-password",
validateUserResetPassword,
  runValidation,
isLoggedIn,
handleResetPassword);

userRouter.put("/:id",isLoggedIn,uploadUserImg.single("image"),updateUserById);

userRouter.put("/manage-user/:id",isLoggedIn,isAdmin,handleManageUserStatusById);


userRouter.put("/update-password/:id",
validateUserPasswordUpdate ,
runValidation,
isLoggedIn,
handleUpdatePassword);

userRouter.post("/forget-password",
validateUserForgetPassword,
runValidation,
handleForgetPassword);








module.exports= userRouter;