const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
      // Ensure that the user is available (from middleware, usually after authentication)
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove password and any sensitive information before returning user profile
      const { password, ...userProfile } = user.toObject();
      
      // Return the cleaned-up user profile
      return res.status(200).json({ user: userProfile });
    } catch (error) {
      // Enhanced error logging
      console.error('Error fetching user profile:', error);
  
      // Return a more descriptive error message with status code 500
      return res.status(500).json({ message: 'Internal server error', error: error.message });
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
   const uploadProfilePhoto = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Update profile photo URL
      user.profilePhoto = `/uploads/${req.file.filename}`;
      await user.save();
  
      res.json({ message: 'Profile photo updated successfully', profilePhoto: user.profilePhoto });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



//Update Profile Photo
exports.uploadProfilePhoto = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Update profile photo URL
      user.profilePhoto = `/uploads/${req.file.filename}`;
      await user.save();
  
      res.json({ message: 'Profile photo updated successfully', profilePhoto: user.profilePhoto });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Function to check if the week has reset
function isNewWeek(lastReset, currentDate) {
  const lastResetDate = new Date(lastReset);
  const currentWeek = currentDate.getWeek();
  const lastResetWeek = lastResetDate.getWeek();
  return currentWeek !== lastResetWeek;
}

// Function to update user earnings
const updateEarnings = async (req, res) => {
  try {
    let { userId, earnings } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentDate = new Date();

    // Check if the earnings need to be reset for the week
    if (isNewWeek(user.last_reset, currentDate)) {
      user.weekly_earnings = 0;
      user.last_reset = currentDate;
    }

    // Check if the earnings exceed the limit
    if (user.weekly_earnings + earnings > user.weekly_earnings_limit) {
      earnings = user.weekly_earnings_limit - user.weekly_earnings; // Cap the earnings
    }

    // Update user earnings
    user.weekly_earnings += earnings;
    await user.save();

    return res.status(200).json({
      message: `Earnings updated successfully. You can still earn $${user.weekly_earnings_limit - user.weekly_earnings} this week.`,
      updated_earnings: user.weekly_earnings
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get user details including their earnings
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      fullName: user.fullName,
      vip_level: user.vip_level,
      weekly_earnings: user.weekly_earnings,
      weekly_earnings_limit: user.weekly_earnings_limit,
      remaining_earnings: user.weekly_earnings_limit - user.weekly_earnings
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller to update last visited and check activity
const updateLastVisited = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the last visited time to the current time
    user.last_visited = new Date();
    
    // Check if the user is still active
    await user.checkActivity();

    // Respond with the updated status
    return res.status(200).json({
      message: user.isFrozen ? 'Your account is frozen due to inactivity.' : 'Welcome back! Your account is active.',
      isFrozen: user.isFrozen,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// Controller for updating availability
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body; // Expected to be a boolean value (true or false)

    // Ensure that the provided availability is a boolean value
    if (typeof availability !== 'boolean') {
      return res.status(400).json({ message: 'Availability must be a boolean value (true or false)' });
    }

    // Find the user by ID (from authentication)
    const user = await User.findById(req.user.id); // Assumes `req.user.id` is set by the authentication middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the isAvailable field
    user.isAvailable = availability;

    // Save the updated user document
    await user.save();

    // Return the updated availability status
    return res.status(200).json({
      message: `Availability updated successfully to ${availability ? 'available' : 'unavailable'}`,
      isAvailable: user.isAvailable,
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { updateAvailability };




module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateKYC,
  uploadProfilePhoto,
  getUserDetails,
  updateEarnings,
  updateLastVisited,
  updateAvailability,
 // Ensure this is here
};

