const {Schema,model} = require("mongoose");
const {defaultProductImage } = require("../secret");

const productSchema = new Schema({

    name:{
        type:String,
        required:[true,"product name is required"],
        trim:true,
        unique:true,
        minLength:[3,"The minLength can be minimum 3 characters"],
        maxLength:[150 ,"The maxLength can be maximum 150 characters"],
  },
  
  slug:{
    type:String,
    required:[true,"Product slug is require"],
    lowercase:true,
    unique:true,
  },
      
description:{
    type:String,
    required:[true,"Product description is require"],
    trim:true,
    unique:true,
    minLength:[3,"The minLength of product description can be minimum 3 characters"],
  },
price: {
        type:Number,
        require:[true,"product price is required"],
        validate:{
            validator :(v) => v > 0
            ,
            message:(props)=>
                `${props.value}is not a valid price, Price must be greater than 0`
            
        }
      },
quantity:{
        type:Number,
        require:[true,"product quantity is required"],
        validate:{
            validator :(v) => v > 0
            ,
            message:(props)=>
                `${props.value}is not a valid quantity, quantity must be greater than 0`
            
        }
      },
sold:{
        type:Number,
        require:[true,"product sold is required"],
        default:0,
        validate:{
            validator :(v) => v > 0
            ,
            message:(props)=>
                `${props.value}is not a valid sold quantity, sold quantity must be greater than 0`
            
        }
      },
shipping:{
        type:Number,
        default:0,// shipping free 0 or paid
      },

      image:{ 
        type: String,
        default:defaultProductImage,
      },

      category:{
       type:Schema.Types.ObjectId,
       ref:"Categories",
       require:true,
      }
      
},{timestamps:true});


const Product = model("Product",productSchema);

module.exports = Product;