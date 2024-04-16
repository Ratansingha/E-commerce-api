const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");


const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            throw createError(401, "access Token not found,Please login");
        }
        const decoded = jwt.verify(token, jwtAccessKey);
        if (!decoded) {
            throw createError(401, "Invalid access Token , please login again")
        }

        req.user = decoded.user;

        next()
    } catch (error) {
        return next(error)
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
     try {
           if (accessToken) {
            const decoded = jwt.verify(accessToken, jwtAccessKey);
            if (decoded) {
                throw createError(400, "User is already loggedIn") 
            }          
        }
     } catch (error) {
         throw error;
     }
        next();
    } catch (error) {
        next(error)
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            throw createError(403, "Forbidden ,you must an admin to access this data")
        }
        next();
    } catch (error) {
        next(error)
    }
};

module.exports = {isLoggedIn,isLoggedOut,isAdmin}