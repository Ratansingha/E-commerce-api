const {Schema,model} = require("mongoose");
const bcrypt = require("bcryptjs");

const categorySchema = new Schema({

    name:{
        type:String,
        required:[true,"Category name is required"],
        unique:true,
        trim:true,
        unique:true,
        minLength:[3,"The minLength can be minimum 3 characters"],
    },
 
      slug:{
    type:String,
    required:[true,"Category slug is require"],
    lowercase:true,
    unique:true,
      }
      
},{timestamps:true});


const Category = model("Categories",categorySchema);

module.exports = Category;