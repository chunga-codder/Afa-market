// notificationService.js
import { getAuthToken } from './authService'; // Assuming you have an authService to get the token

const API_URL = 'YOUR_BACKEND_URL/notifications';  // Replace with your actual backend URL

// Get notifications for a specific user
export const getNotifications = async (userId) => {
  try {
    const token = await getAuthToken();  // Assuming you have a way to get the token
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to fetch notifications');
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark a notification as read
export const markAsRead = async (notificationId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/mark-as-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notificationId }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to mark notification as read');
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
