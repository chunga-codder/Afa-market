// src/services/escrowService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://localhost:5000/api/escrow";  // Update with actual API URL

// Get authentication token
const getAuthToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

// Create an escrow
export const createEscrow = async (transactionId, amount) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionId, amount }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to create escrow", error);
    return false;
  }
};

// Release funds
export const releaseEscrow = async (escrowId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/release/${escrowId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to release escrow", error);
    return false;
  }
};

// Create a dispute
export const createDispute = async (escrowId, reason) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/dispute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ escrowId, reason }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to create dispute", error);
    return false;
  }
};

// Resolve a dispute (Admin Only)
export const resolveDispute = async (escrowId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/resolve-dispute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ escrowId }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to resolve dispute", error);
    return false;
  }
};

// Get all escrows (For Admin)
export const getEscrows = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/all`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  } catch (error) {
    console.error("Failed to fetch escrows", error);
    return [];
  }
};
