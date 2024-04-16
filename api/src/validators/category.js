const {body} = require("express-validator");

const validateCategory =[
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Category Name is required. Enter your Category name")
    .isLength({min:3})
    .withMessage("Category name should be at least 3 characters long"),
    
    
]


module.exports= {validateCategory}