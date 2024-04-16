
const uploadUserImage = process.env.UPLOAD_FILE || "public/images/users";

const uploadProductImage = process.env.UPLOAD_FILE || "public/images/products";

const maxFileSize = Number( process.env.MAX_FILE_SIZE) || "2097152";

const allowedFileType = process.env.FILE_TYPE || ["image/jpg","image/jpeg","image/png"];

module.exports = { uploadUserImage, maxFileSize, allowedFileType, uploadProductImage };