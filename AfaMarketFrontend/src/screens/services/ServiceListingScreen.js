import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getServices } from '../../services/serviceService'; // Assuming you have a service function to fetch services

const ServiceListingScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  // Function to load services from the backend
  const loadServices = async () => {
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Navigate to Service Details Screen
  const handleServicePress = (serviceId) => {
    navigation.navigate('ServiceDetails', { serviceId }); // Adjust navigation as per your navigation structure
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity style={styles.serviceItem} onPress={() => handleServicePress(item._id)}>
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <Text style={styles.servicePrice}>Price: {item.price} CFA</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Services</Text>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    color: 'green',
  },
});

export default ServiceListingScreen;
