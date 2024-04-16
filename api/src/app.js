const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const morgan = require('morgan');
const bodyParser = require("body-parser")
const createError= require("http-errors")
const xssClean = require("xss-clean");
const  rateLimit = require('express-rate-limit');

const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

//Rate limiter...
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  //1 minute
  max: 5,
  message: "too many request from this ip please try again later"
});

// All Middle Ware...
app.use(rateLimiter)
app.use(morgan('dev'));
app.use(xssClean());
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Express middle ware 
  app.use("/api/user",userRouter)
  app.use("/api/seed",seedRouter)
  app.use("/api/auth",authRouter)
  app.use("/api/category",categoryRouter)
  app.use("/api/product",productRouter)

//Client error handling 
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

//Server  error handling => all the errors 
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message
  });
});


module.exports = app;