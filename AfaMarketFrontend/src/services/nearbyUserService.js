import { getAuthToken } from './authService'; // Assuming you have an authService
import {timeout} from '../utils/timeout'
const API_URL = 'YOUR_BACKEND_URL/nearby-users';  // Replace with your actual backend URL

// Search for nearby users
export const searchNearbyUsers = async (latitude, longitude) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ latitude, longitude }),
    });
    timeout(10000)

    const data = await response.json();
    if (response.ok) {
      return data; // This will contain nearby places and users
    } else {
      throw new Error(data.error || 'Failed to search for nearby users');
    }
  } catch (error) {
    console.error('Error searching nearby users:', error);
    throw error;
  }
};
