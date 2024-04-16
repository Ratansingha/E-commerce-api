const  cloudinary = require("../config/cloudinary");


const publicIdWithoutExtensionFromUrl = async (imageUrl) => {
    try {
        const pathSegments = imageUrl.split("/");

        //get the last segment
        const lastSegments = pathSegments[pathSegments.length - 1];

        const valueWithoutExtension = lastSegments.replace(".jpg", "");

        return valueWithoutExtension;

    } catch (error) {
        throw error;
    }
};

const deleteFileFromCloudinary = async (folderName, publicId,modelName) => {
    try {
        const { result } = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
        if (result !=="ok") {
            throw new Error(`${modelName} image was not deleted successfully from cloudinary . Please try again`);
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { publicIdWithoutExtensionFromUrl,deleteFileFromCloudinary };