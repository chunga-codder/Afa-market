const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/kyc/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Invalid file type"));
    },
}).single("idCard");

exports.uploadIDCard = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        
        try {
            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.kycVerified = true;
            user.idCardImage = req.file.path; // Save file path
            await user.save();

            res.status(200).json({ message: "KYC Verification Successful", user });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });
};
