import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://localhost:5000/api/services';

// Get authentication token
const getAuthToken = async () => {// Button.js
  import React from 'react';
  import { TouchableOpacity, Text, StyleSheet } from 'react-native';
  
  const Button = ({ title, onPress, style }) => {
    return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
  
  export default Button;
  
  return await AsyncStorage.getItem('authToken');
};

// Get predefined service categories
export const getServiceCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch service categories', error);
    return [];
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to create service', error);
    return null;
  }
};

// Get all active services
export const getServices = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch services', error);
    return [];
  }
};

// Get a specific service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await fetch(`${API_URL}/${serviceId}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch service details', error);
    return null;
  }
};

// Update a service (only provider)
export const updateService = async (serviceId, updatedData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to update service', error);
    return null;
  }
};

// Delete a service (only provider)
export const deleteService = async (serviceId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/${serviceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to delete service', error);
    return false;
  }
};