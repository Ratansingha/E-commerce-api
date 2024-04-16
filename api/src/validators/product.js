const {body} = require("express-validator");

const validateProduct =[
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Product Name is required. Enter your Product name")
    .isLength({min:3,max:150})
    .withMessage("Product name should be at least 3-150 characters long"),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({min:3,max:150})
    .withMessage("Description should be at least 3-150 characters long"),

    body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({min:0})
    .withMessage("Price must be positive number"),

    body("category")
    .trim()
    .notEmpty()
    .withMessage("category is required"),
    
    body("image")
       .optional()
       .isString()
       .withMessage("Product image is optional"),

    body("quantity")
    .trim()
    .notEmpty()
    .withMessage("quantity is required")
    .isFloat({min:1})
    .withMessage("Price must be positive number"),

    
    
]


module.exports= {validateProduct}