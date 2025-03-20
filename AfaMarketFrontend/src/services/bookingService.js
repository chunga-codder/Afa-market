// src/services/bookingService.js

import { API_BASE_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to create a booking request (User clicks "Book Now")
export const createBookingRequest = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/book-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ serviceId }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create booking request');
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function for agent to accept a booking request
export const acceptBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/accept-booking/${bookingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to accept booking');
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function for agent to decline a booking request
export const declineBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/decline-booking/${bookingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to decline booking');
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function to fetch auth token securely
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token ? token : '';
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return '';
  }
};
