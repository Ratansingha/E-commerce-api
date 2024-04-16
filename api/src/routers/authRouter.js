const express = require("express");
const runValidation = require("../validators");
const { handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middleware/auth");
const { validateUserLogIn, validateRefreshToken } = require("../validators/auth");
const authRouter= express.Router();

authRouter.post("/login",isLoggedOut,validateUserLogIn,runValidation,handleLogin);

authRouter.post("/logout",isLoggedIn,handleLogout);

authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtectedRoute);


module.exports= authRouter;