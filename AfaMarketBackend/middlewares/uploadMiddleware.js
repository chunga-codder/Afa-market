const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Define size limit (in bytes) to decide storage method
const LOCAL_STORAGE_LIMIT = 2 * 1024 * 1024; // 2MB

// Local Storage Setup (for small files)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save locally in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Cloudinary Storage Setup (for large files)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "mp4", "mp3", "wav", "ogg"],
  },
});

// File Filter (Only allow images, videos, and documents)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|mp4|mp3|wav|ogg/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images, videos, and documents are allowed"));
};

// Dynamic Storage Selection Based on File Size
const storage = multer({
  storage: (req, file, cb) => {
    if (file.size <= LOCAL_STORAGE_LIMIT) {
      multer({ storage: localStorage, fileFilter }).single("file")(req, file, cb);
    } else {
      multer({ storage: cloudinaryStorage, fileFilter }).single("file")(req, file, cb);
    }
  },
});

module.exports = storage;
