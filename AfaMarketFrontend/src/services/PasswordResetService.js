// services/passwordResetService.js

import axios from 'axios';

const API_URL = 'https://your-api-url.com'; // Replace with your actual API URL

// Function to handle password reset request
export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { email });

    if (response.status === 200) {
      return { success: true, message: 'Password reset link has been sent to your email.' };
    } else {
      return { success: false, message: response.data.message || 'Failed to send reset link.' };
    }
  } catch (error) {
    console.error('Error in password reset service:', error);
    return { success: false, message: 'Something went wrong, please try again later.' };
  }
};
