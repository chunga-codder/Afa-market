const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // Retrieved from the middleware
    const { password, ...userProfile } = user.toObject(); // Remove password from the profile
    res.json({ user: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user details
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.location = location || user.location;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// Change User Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update KYC Status
const updateKYC = async (req, res) => {
  try {
    const { documentType, documentImage, selfieImage } = req.body;

    if (!documentType || !documentImage || !selfieImage) {
      return res.status(400).json({ message: 'Please provide all required fields for KYC' });
    }

    const user = req.user;
    user.kyc.documentType = documentType;
    user.kyc.documentImage = documentImage;
    user.kyc.selfieImage = selfieImage;
    user.kyc.verified = false; // Set as false initially; verified will be done after admin approval

    await user.save();
    res.status(200).json({ message: 'KYC information updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating KYC' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateKYC,
};
