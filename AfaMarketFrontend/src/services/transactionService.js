import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL (change to your actual backend URL)
const API_URL = 'https://localhost:5000/api/transactions'; 

// Function to get auth token from AsyncStorage
const getAuthToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// Helper function for handling fetch errors
const handleFetchError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
};

// Deposit Funds
export const depositFunds = async (amount) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    await handleFetchError(response);
    return true;
  } catch (error) {
    console.error('Deposit failed', error);
    return false;
  }
};

// Withdraw Funds
export const withdrawFunds = async (amount) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    await handleFetchError(response);
    return true;
  } catch (error) {
    console.error('Withdraw failed', error);
    return false;
  }
};

// Transfer Funds
export const transferFunds = async (receiverId, amount) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId, amount }),
    });
    await handleFetchError(response);
    return true;
  } catch (error) {
    console.error('Transfer failed', error);
    return false;
  }
};

// Create a Transaction
export const createTransaction = async (amount, senderId, receiverId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, senderId, receiverId }),
    });
    await handleFetchError(response);
    return true;
  } catch (error) {
    console.error('Create Transaction failed', error);
    return false;
  }
};

// Rate a Service Provider after Transaction
export const rateTransaction = async (transactionId, rating) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionId, rating }),
    });
    await handleFetchError(response);
    return true;
  } catch (error) {
    console.error('Rating failed', error);
    return false;
  }
};

// Get Transaction History
export const getTransactionHistory = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    await handleFetchError(response);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};
