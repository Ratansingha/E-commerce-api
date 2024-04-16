const createError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { successResponse } = require("./responseController");
const { jwtAccessKey, refreshTokenKey } = require("../secret");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../helper/cookie");


const handleLogin =async (req,res,next)=>{
try {
   //email and password req.body
   const {email,password}= req.body;
   //isExists
   const user = await User.findOne({email});
if(!user){
    throw createError(404,"user not found with this email,Please register first");
}
   //compare with password
   const isPasswordMatch = await bcrypt.compare(password,user.password);

   if(!isPasswordMatch){
    throw createError(401,"Email or Password not matched");
   }

   //isBanned
   if(user.isBanned){
    throw createError(401,"you are banned please contact with authority");
   }

   //token generate,cookie
   const accessToken = createJsonWebToken({user},jwtAccessKey,"5m");

  setAccessTokenCookie(res,accessToken);

//    res.cookie('access_token',accessToken,{
//     maxAge:5*60*60*1000, //5 minutes
//     httpOnly:true,
//     sameSite:"none",
//    })

   // refreshToken generate,cookie
   const refreshToken = createJsonWebToken({user},refreshTokenKey,"7d");

 setRefreshTokenCookie(res,refreshToken);

//    res.cookie('refresh_token',refreshToken,{
//     maxAge:7*24*60*60*1000, //7days
//     httpOnly:true,
//     sameSite:"none",
//    })

   return successResponse(res,{
    statusCode:200,
    success:true,
    message:"user was loggedIn successfully", 
    payload:user 
});
} catch (error) {
    next(error)
}
}
const handleLogout =async (req,res,next)=>{
try {
res.clearCookie("access_token");

   return successResponse(res,{
    statusCode:200,
    success:true,
    message:"user was logged out successfully",     
});
} catch (error) {
    next(error)
}
};

const handleRefreshToken =async (req,res,next)=>{
 try {
const oldRefreshToken = req.cookies.refresh_token;

//verify the old refresh token
 const decodedToken = jwt.verify(oldRefreshToken,refreshTokenKey);

 if(!decodedToken){
    throw createError(401,"Invalid refresh token, Please login again");
 };

  //token generate,cookie
  const accessToken = createJsonWebToken(decodedToken.user,jwtAccessKey,"5m");
  
setAccessTokenCookie(res,accessToken);

//   res.cookie('access_token',accessToken,{
//    maxAge:5*60*60*1000, //5 minutes
//    httpOnly:true,
//    sameSite:"none",
//   });

    return successResponse(res,{
        statusCode:200,
        success:true,
        message:"new access token is generated",     
    });
 } catch (error) {
  next(error)  
 }
}

const handleProtectedRoute =async (req,res,next)=>{
 try {

 const accessToken  = req.cookies.access_token;

 //verify the access token key
 const decodedToken = jwt.verify(accessToken,jwtAccessKey);

 if(!decodedToken){
    throw createError(401,"Invalid access token, please login again")
 };

    return successResponse(res,{
        statusCode:200,
        success:true,
        message:"protected resources accessed successfully",     
    });

 } catch (error) {
  next(error)  
 }
}



module.exports = {handleLogin,handleLogout,handleRefreshToken,handleProtectedRoute};