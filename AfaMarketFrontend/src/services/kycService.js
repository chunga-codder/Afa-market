const User = require("../models/User");
const multer = require("multer");
const path = require("path");
// const KYCService = require("some-kyc-service"); // Third-party KYC service (e.g., Jumio, Onfido)

// 🟢 Multer Setup for File Uploads
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
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Invalid file type"));
  },
}).single("idCard");

// 🟢 Upload ID Card
exports.uploadIDCard = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.kyc.idCardImage = req.file.path;
      user.kyc.verified = false;
      await user.save();

      res.status(200).json({ message: "ID Card uploaded successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

// 🟢 Submit Full KYC Documents
exports.submitKYC = async (req, res) => {
  try {
    const { documentType, documentImage, selfieImage } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.kyc = { documentType, documentImage, selfieImage, verified: false };
    await user.save();

    res.json({ message: "KYC submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Get KYC Status for User
exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      status: user.kyc.verified ? "verified" : "pending",
      documentImage: user.kyc.documentImage || null,
      selfieImage: user.kyc.selfieImage || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Admin Approve KYC
exports.approveKYC = async (req, res) => {
  try {
    const { userId, adminId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.kyc.verified = true;
    user.kyc.approvedBy = adminId;
    await user.save();

    res.json({ message: "KYC approved by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Admin Reject KYC
exports.rejectKYC = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.kyc.verified = false;
    user.kyc.rejectionReason = reason;
    await user.save();

    res.json({ message: "KYC rejected", reason });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🟢 Auto KYC Approval (Third-Party Verification)
exports.autoApproveKYC = async (req, res) => {
  try {
    const { userId, documents } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const kycResponse = await KYCService.verifyDocuments(documents);

    if (kycResponse.status === "verified") {
      user.kyc.verified = true;
      user.kyc.automaticallyApproved = true;
      await user.save();
      res.json({ message: "KYC automatically approved" });
    } else {
      user.kyc.verified = false;
      await user.save();
      res.status(400).json({ message: "KYC verification failed. Documents not approved." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Get All Pending KYC Requests (Admin Only)
exports.getPendingKYCs = async (req, res) => {
  try {
    const pendingKYCs = await User.find({ "kyc.verified": false }).select("name email kyc");
    res.json(pendingKYCs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
