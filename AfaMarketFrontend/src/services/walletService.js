import axios from 'axios';
import { API_URL } from '../config/apiConfig';

export const getWalletBalance = async (token) => {
  const response = await axios.get(`${API_URL}/wallet/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const depositFunds = async (amount, token) => {
  const response = await axios.post(
    `${API_URL}/wallet/deposit`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const withdrawFunds = async (amount, token) => {
  const response = await axios.post(
    `${API_URL}/wallet/withdraw`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Transfer funds between users
export const transferFunds = async (recipientId, amount, token) => {
  const response = await axios.post(
    `${API_URL}/wallet/transfer`,
    { recipientId, amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Release funds from escrow
export const releaseEscrow = async (transactionId, token) => {
  const response = await axios.post(
    `${API_URL}/wallet/release`,
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Raise a dispute for a transaction
export const raiseDispute = async (transactionId, reason, token) => {
  const response = await axios.post(
    `${API_URL}/wallet/dispute`,
    { transactionId, reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Resolve a dispute (admin only)
export const resolveDispute = async (disputeId, resolution, token) => {
  const response = await axios.post(
    `${API_URL}/wallet/resolve-dispute`,
    { disputeId, resolution },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

