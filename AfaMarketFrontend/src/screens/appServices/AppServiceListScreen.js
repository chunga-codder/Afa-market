import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { getServices } from '../../services/appserviceService';  // Assuming you have a service for API calls
import ProfileHeader from '../components/ProfileHeader'; // Import ProfileHeader
import Avatar from '../components/Avatar'; // Import Avatar Component
import { useSelector } from 'react-redux'; // Access user info from Redux

const ServiceListScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);  // Get user data from Redux store

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderService = ({ item }) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate('ServiceDetails', { serviceId: item._id })}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header with Avatar */}
      <ProfileHeader user={user}>
        <Avatar imageUrl={user.profilePhoto} size={80} />
      </ProfileHeader>

      <Text style={styles.title}>All Active Services</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item._id}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  serviceItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  serviceTitle: {
    fontSize: 18,
  },
});

export default ServiceListScreen;
