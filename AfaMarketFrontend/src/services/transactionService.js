import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://yourapi.com/api/transactions'; // Replace with your actual API URL

const getAuthToken = async () => {
  return await AsyncStorage.getItem('authToken');
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
    return response.ok;
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
    return response.ok;
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
    return response.ok;
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
    return response.ok;
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
    return response.ok;
  } catch (error) {
    console.error('Rating failed', error);
    return false;
  }
};

// Add the getTransactionHistory function to fetch history
export const getTransactionHistory = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/history`, {  // Assuming your backend has this route
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        return data;  // Return the transaction history
      } else {
        throw new Error(data.message || 'Failed to fetch transaction history');
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  };
  