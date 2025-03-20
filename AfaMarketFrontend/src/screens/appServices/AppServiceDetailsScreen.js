import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getServiceById } from '../../services/appserviceService';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/ProfileHeader'; // Import ProfileHeader
import Avatar from '../components/Avatar'; // Import Avatar Component
import { useSelector } from 'react-redux'; // Access user info from Redux

const ServiceDetailsScreen = ({ route }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth); // Get user data from Redux store
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const data = await getServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header with Avatar */}
      <ProfileHeader user={user}>
        <Avatar imageUrl={user.profilePhoto} size={80} />
      </ProfileHeader>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>{service?.title}</Text>
          <Text style={styles.description}>{service?.description}</Text>
          <Text>Category: {service?.category}</Text>
          <Text>Price: ${service?.price}</Text>

          {/* Book Now Button */}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookingConfirmation', { service })}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>

          {/* Additional Button Example */}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => console.log('Contacting service provider')}
          >
            <Text style={styles.contactButtonText}>Contact Service Provider</Text>
          </TouchableOpacity>
        </>
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceDetailsScreen;
