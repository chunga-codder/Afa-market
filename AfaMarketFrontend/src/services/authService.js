// src/services/authService.js
import axios from 'axios';
import { API_URL } from '../config/apiConfig';
import FormData from 'form-data'; // Add for file uploads
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('password', userData.password);

    // Add the ID card image to the form data
    if (userData.idCardImage) {
      formData.append('idCard', {
        uri: userData.idCardImage,
        type: 'image/jpeg',  // Adjust type as per the actual image
        name: 'idCard.jpg',
      });
    }

    // Add the facial image to the form data
    if (userData.faceImage) {
      formData.append('faceImage', {
        uri: userData.faceImage,
        type: 'image/jpeg',  // Adjust type as per the actual image
        name: 'faceImage.jpg',
      });
    }

    const response = await axios.post(`${API_URL}/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      const { token, user } = response.data;

      // Save token to AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem("kycStatus", data.kycStatus); // Store KYC status

      return { token, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
};
