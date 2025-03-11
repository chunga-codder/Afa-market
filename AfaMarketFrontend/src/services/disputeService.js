// src/services/disputeService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://yourapi.com/api/disputes";

// Get authentication token
const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

// Create a dispute for a transaction
export const createDispute = async (transactionId, reason) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionId, reason }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to create dispute", error);
    return false;
  }
};

// Send a message in a dispute
export const sendMessageInDispute = async (disputeId, message) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ disputeId, message }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send message", error);
    return false;
  }
};

// Get all disputes
export const getDisputes = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  } catch (error) {
    console.error("Failed to fetch disputes", error);
    return [];
  }
};

// Resolve a dispute (Admin Only)
export const resolveDispute = async (disputeId) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ disputeId }),
      });
  
      return response.ok;
    } catch (error) {
      console.error("Failed to resolve dispute", error);
      return false;
    }
  };

  
// Close a dispute (Admin Only)
export const closeDispute = async (disputeId) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ disputeId }),
      });
  
      return response.ok;
    } catch (error) {
      console.error("Failed to close dispute", error);
      return false;
    }
  };