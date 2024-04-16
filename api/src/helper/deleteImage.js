const fs = require("fs/promises");

const deleteImage = async (imagePath) => {
    try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log("image was deleted");
    } catch (error) {
        console.error("image doesn't exists or could not be deleted");
    };
};

module.exports = { deleteImage };