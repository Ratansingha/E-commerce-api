const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');
const logger = require('../controllers/logger');


const connectDB = async(options={})=>{
    try {
        await mongoose.connect(mongodbURL,options)
        console.log("Connection to Database is successfully established")

        mongoose.connection.on("error",(error)=>{
            console.error("Db connection error:",error);
        })
    } catch (error) {
        console.error("Data base is not connected",error.toString())
    }
}

module.exports = connectDB;