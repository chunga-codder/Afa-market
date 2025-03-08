const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chat_files",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "mp4", "mp3", "wav", "ogg"],
    },
});

const upload = multer({ storage });

module.exports = upload;
