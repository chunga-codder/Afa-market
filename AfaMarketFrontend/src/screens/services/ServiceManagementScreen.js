import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { getAgentServices, updateServiceAvailability, deleteService } from '../services/appserviceService';

const ServiceManagementScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAgentServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (serviceId, currentStatus) => {
    try {
      await updateServiceAvailability(serviceId, !currentStatus);
      fetchServices();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService(serviceId);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Services</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Price: ${item.price}</Text>
              <View style={styles.row}>
                <Text>Available:</Text>
                <Switch
                  value={item.available}
                  onValueChange={() => toggleAvailability(item._id, item.available)}
                />
              </View>
              <View style={styles.buttonRow}>
                <Button title="Edit" onPress={() => navigation.navigate('EditService', { serviceId: item._id })} />
                <Button title="Delete" color="red" onPress={() => handleDeleteService(item._id)} />
              </View>
            </View>
          )}
        />
      )}
      <Button title="Add New Service" onPress={() => navigation.navigate('AddService')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  serviceItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ServiceManagementScreen;
