require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3001;

const mongodbURL = process.env.MONGO_URL || "mongodb://localhost:27017";

const defaultImage = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/Ratan.png";

const defaultProductImage = process.env.DEFAULT_PRODUCT_IMAGE_PATH || "public/images/products/Ratan.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "34hki3kjh43j4h3h3h3h3kl3kd8" 

const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;

const clientUrl= process.env.CLIENT_URL || "";

const jwtAccessKey = process.env.JWT_ACCESS_KEY || "43hki5h454ij5i4j5i"

const resetPassword = process.env.JWT_RESET_PASS_KEY ||"this7is3the2reset8passkey"

const refreshTokenKey =process.env.JWT_REFRESH_KEY || "this5is9new2refresh1key" 

module.exports= {serverPort,mongodbURL,defaultImage,defaultProductImage,jwtActivationKey,smtpUsername,smtpPassword,clientUrl,jwtAccessKey,resetPassword,refreshTokenKey}  