const User = require('../models/User');
const multer = require('multer');
const path = require('path');
// const KYCService = require('some-kyc-service'); // Example for third-party KYC API (e.g., Jumio, Onfido, etc.)

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/kyc/');
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
        cb(new Error('Invalid file type'));
    },
}).single('idCard');

// 🟢 Upload KYC ID Card
exports.uploadIDCard = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const user = await User.findById(req.userId); // Ensure userId is available in req object
            if (!user) return res.status(404).json({ message: 'User not found' });

            user.kycVerified = true;
            user.idCardImage = req.file.path; // Save file path
            await user.save();

            res.status(200).json({ message: 'KYC Verification Successful', user });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });
};

// 🟢 Submit KYC Documents (For registered users and agents)
exports.submitKYC = async (req, res) => {
    const { userId, documentType, documentImage, selfieImage } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Store KYC data
    user.kyc = { documentType, documentImage, selfieImage, verified: false };
    await user.save();
    res.json({ message: 'KYC submitted successfully' });
};

// 🟢 Admin Approve KYC
exports.approveKYC = async (req, res) => {
    const { userId, adminId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Admin manually approves the KYC details
    user.kyc.verified = true;
    user.kyc.approvedBy = adminId;
    await user.save();
    res.json({ message: 'KYC approved by admin' });
};

// 🟢 Automatic KYC Approval (Third-Party Verification)
exports.autoApproveKYC = async (req, res) => {
    const { userId, documents } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Simulate calling a third-party KYC API for document verification
    try {
        const kycResponse = await KYCService.verifyDocuments(documents);

        if (kycResponse.status === 'verified') {
            // If the third-party service verifies the documents
            user.kyc.verified = true;
            user.kyc.automaticallyApproved = true; // Flag for automatic approval
            await user.save();
            res.json({ message: 'KYC automatically approved' });
        } else {
            // If documents verification fails via third-party service
            user.kyc.verified = false;
            await user.save();
            res.status(400).json({ message: 'KYC verification failed. Documents not approved.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
