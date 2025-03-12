const User = require("../models/User");
const multer = require("multer");
const path = require("path");
// const KYCService = require("some-kyc-service"); // Example: Jumio, Onfido, etc.

// 🟢 Multer Setup for File Upload
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

// 🟢 Upload KYC ID Card
exports.uploadIDCard = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.kycVerified = true;
      user.idCardImage = req.file.path;
      await user.save();

      res.status(200).json({ message: "KYC Verification Successful", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

// 🟢 Submit Full KYC Documents
exports.submitKYC = async (req, res) => {
  const { documentType, documentImage, selfieImage } = req.body;
  const user = await User.findById(req.userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  user.kyc = { documentType, documentImage, selfieImage, verified: false };
  await user.save();

  res.json({ message: "KYC submitted successfully" });
};

// 🟢 Get KYC Status for User
exports.getKYCStatus = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    status: user.kyc.verified ? "verified" : "pending",
    documentImage: user.kyc.documentImage || null,
    selfieImage: user.kyc.selfieImage || null,
  });
};

// 🟢 Admin Approve KYC
exports.approveKYC = async (req, res) => {
  const { userId, adminId } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  user.kyc.verified = true;
  user.kyc.approvedBy = adminId;
  await user.save();

  res.json({ message: "KYC approved by admin" });
};

// 🟢 Admin Reject KYC
exports.rejectKYC = async (req, res) => {
  const { userId, reason } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  user.kyc.verified = false;
  user.kyc.rejectionReason = reason;
  await user.save();

  res.json({ message: "KYC rejected", reason });
};

// 🟢 Auto KYC Approval (Third-Party Verification)
exports.autoApproveKYC = async (req, res) => {
  const { userId, documents } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  try {
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

// Update KYC details
exports.updateKYC = async (req, res) => {
    try {
        const { fullName, idNumber, idDocument, selfie } = req.body;
        const userId = req.user.id;

        // Ensure all required fields are provided
        if (!fullName || !idNumber || !idDocument || !selfie) {
            return res.status(400).json({ error: "All KYC fields are required" });
        }

        // Update KYC details in the database
        const user = await User.findByIdAndUpdate(
            userId,
            { kyc: { fullName, idNumber, idDocument, selfie, status: "pending" } },
            { new: true }
        );

        res.json({ message: "KYC updated successfully", kyc: user.kyc });
    } catch (error) {
        console.error("Error updating KYC:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get KYC status
exports.getKYCStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ kycStatus: user.kyc.status });
    } catch (error) {
        console.error("Error fetching KYC status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


