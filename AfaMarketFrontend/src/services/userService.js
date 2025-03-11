// src/services/userService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://yourapi.com/api/users";

// Get authentication token
const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

// Get User Profile
export const getUserProfile = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return null;
  }
};

// Update User Profile
export const updateUserProfile = async (profileData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  } catch (error) {
    console.error("Failed to update user profile", error);
    return null;
  }
};

// Change Password
export const changePassword = async (passwordData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
    return response.json();
  } catch (error) {
    console.error("Failed to change password", error);
    return null;
  }
};

// Update KYC Information
export const updateKYC = async (kycData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/kyc`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kycData),
    });
    return response.json();
  } catch (error) {
    console.error("Failed to update KYC", error);
    return null;
  }
};
