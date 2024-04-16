const slugify  = require("slugify")
const Category = require("../models/categoryModel")

//create Category
const createCategory =async (name)=>{
    const newCategory = await Category.create({
        name:name,
        slug:slugify(name)
    })
    return newCategory;
};

//Get ALl category
const getCategory =async ()=>{   
return await Category.find({}).select("name slug").lean();
};

//Get single Category by slug
const singleCategory =async (slug)=>{   
return await Category.find({slug}).select("name slug").lean();
};

//Update category by slug
const updateCategory = async (name,slug)=>{  

    const updateCategory = await Category.findOneAndUpdate(
        {slug},
        {$set:{name:name,slug:slugify(name)}},{new:true});

return  updateCategory
};

//Update category by slug
const deleteCategory = async (slug)=>{  

 const  result =   await Category.findOneAndDelete({slug});
return result;

};


module.exports = {createCategory,getCategory,singleCategory,updateCategory,deleteCategory}