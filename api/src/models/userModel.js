const {Schema,model} = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImage } = require("../secret");

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"user name is required"],
        unique:true,
        trim:true,
        minLength:[3,"The minLength can be minimum 3 characters"],
        maxLength:[31,"User name can be maximum 31 characters"],
    },
    
    email:{
        type:String,
        required:[true,"user email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        validate:{
            validator:(v)=>{
                return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(v)
            },
            message:"please enter a valid email"
        },
    },
        password:{
            type:String,
            required:[true,"user password is required"],
            trim:true,
            minLength:[6,"The minLength can be minimum 6 characters"],
             set:(v)=>bcrypt.hashSync(v,bcrypt.genSaltSync(10))
    },
        image:{
            type: String,
            default:defaultImage,
         },
        address:{
            type:String,
            required:[true,"user address is required"],
         },
        phone:{
            type:String,
            required:[true,"user require is required"],
         },
        isAdmin:{
            type:Boolean,
            default:false,
         },
        isBanned:{
            type:Boolean,
            default:false,
         },

},{timestamps:true});


const User = model("Users",userSchema);

module.exports = User;