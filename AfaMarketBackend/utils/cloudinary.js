const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: processs.env.CLOUD_PUBLIC_API_KEY,
    api_secret: process.env.CLOUD_SECRET_API_KEY ,
});

module.exports = cloudinary;
