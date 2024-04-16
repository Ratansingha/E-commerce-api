const slugify = require("slugify");
const createError = require("http-errors");


const Product = require("../models/productModel");

// const { deleteImage } = require("../helper/deleteImage");
const { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary } = require("../helper/cloudinaryHelper");
const cloudinary = require("../config/cloudinary");


const createProduct = async (productsData, image) => {
  
    if (image && image.size > 1024 * 1024 * 2) {
        throw createError(400, "file Too large, it's must be less than 2mb")
    };

    const product = await Product.create({ ...productsData, slug: slugify(productsData.name) });
    
    // if (image) {
    //     productsData.image = image;
    // };
         if (image) {
                const response = await cloudinary.uploader.upload(image, {
                    folder:"ecommerceMern/products"
                });
                productsData.image = response.secure_url; 
            }

    const productExists = await Product.exists({ name: productsData.name });
    

    if (productExists) {
        throw createError(409, "Product with this name already exits");
    };
    return product;
   
};

const deleteProduct = async (slug) => {
    try {
        const existingProduct = await Product.findOne({ slug });

        // if (product.image) {
        //     await deleteImage(product.image)
        // };
        console.log(existingProduct);

        if (!existingProduct) {
            throw createError(404, "There is no product found to delete");
        };
        if (existingProduct && existingProduct.image) {
            const publicId = await publicIdWithoutExtensionFromUrl(existingProduct.image);

            const { result } = await cloudinary.uploader.destroy(`ecommerceMern/products/${publicId}`);
            if (result !== "ok") {
                throw new Error("user image was not deleted successfully from cloudinary. please try again")
            }
        }
         await Product.findOneAndDelete({ slug });
    } catch (error) {
        throw error;
    };
};

const updateProduct = async (slug,req) => {
    try {
        const product = await Product.findOne({ slug: slug });
        if (!product) {
            throw createError(404,"product not found with this slug")
        };

        const updateOptions = { new: true, runValidation: true, context: "query" };

        let updates = {};
        const allowedFields = ["name", "description", "price", "quantity", "sold", "shipping"];

        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                if (key === "name") {
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key]
            }
        };
        
    
        const image = req.file?.path;

        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "file Too large, it's must be less than 2mb")
            };
                const response = await cloudinary.uploader.upload(image, {
            folder: "ecommerceMern"
                });
            updates.image = response.secure_url;
        };

    

    
        const updatedProduct = await Product.findOneAndUpdate({ slug }, updates, updateOptions);


        if (!updatedProduct) {
            throw createError(404, "product with this slug can not be  updated")
        }

        //delete the previous image from cloudinary
        
        if (product.image) {
            const publicId = await publicIdWithoutExtensionFromUrl(product.image);
            await deleteFileFromCloudinary("ecommerceMern/products", publicId, "Product");
        }

        return updatedProduct;

    } catch (error) {
        throw error;
    }
};


module.exports = {createProduct,deleteProduct, updateProduct}