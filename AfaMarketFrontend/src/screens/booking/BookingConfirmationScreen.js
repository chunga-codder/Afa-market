import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { confirmBooking, acceptBooking, declineBooking } from '../../services/bookingService';
import { Avatar } from 'react-native-paper';
import { getUserProfile } from '../../services/userService';  // Add API call to fetch user profile
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingConfirmationScreen = ({ route }) => {
  const { service, user, booking } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const profile = await getUserProfile(token);
          setLoggedInUser(profile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserData();
  }, []);

  const isAgent = loggedInUser && loggedInUser.id === booking?.agentId;

  const handleConfirmBooking = async () => {
    try {
      setIsLoading(true);
      const response = await confirmBooking(service?.id);

      if (response.success) {
        navigation.navigate('BookingSuccess', { serviceId: service?.id });
      } else {
        Alert.alert('Error', response.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setIsLoading(true);
      const response = await acceptBooking(booking?.id);

      if (response.success) {
        Alert.alert('Success', 'Booking Accepted!');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message || 'Could not accept booking.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      const response = await declineBooking(booking?.id);

      if (response.success) {
        Alert.alert('Booking Rejected', 'You have successfully rejected the booking.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message || 'Could not reject booking.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={50}
          source={user?.profilePhoto ? { uri: user.profilePhoto } : require('../../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.username || 'Guest'}</Text>
      </View>

      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.label}>Service: {service?.title}</Text>
      <Text style={styles.label}>Category: {service?.category}</Text>
      <Text style={styles.label}>Price: ${service?.price}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          {isAgent ? (
            <>
              <Button title="Accept Booking" onPress={handleAccept} color="#28a745" />
              <Button title="Reject Booking" onPress={handleReject} color="#dc3545" />
            </>
          ) : (
            <Button title="Confirm Booking" onPress={handleConfirmBooking} color="#007bff" />
          )}
        </View>
      )}

      <View style={styles.additionalInfo}>
        <Button title="View Profile" onPress={() => navigation.navigate('Profile', { userId: user?.id })} color="#6c757d" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  avatar: {
    marginRight: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  additionalInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default BookingConfirmationScreen;
