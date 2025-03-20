// src/screens/BookingSuccessScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';  // Correct import for Avatar component

const BookingSuccessScreen = ({ route }) => {
  const { user } = route.params;  // Assuming user data is passed through route params
  const [loading, setLoading] = useState(true);  // State to track loading status
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate loading process (e.g., fetching user data or booking status)
    setTimeout(() => {
      setLoading(false);  // After 2 seconds, set loading to false
    }, 2000);
  }, []);

  const handleGoHome = () => {
    // Navigate to Home after booking success
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />  // Show loading spinner while waiting
      ) : (
        <>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={50}
              source={user?.profilePhoto ? { uri: user.profilePhoto } : require('../../assets/default-avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.username}>{user?.username || 'Guest'}</Text>
          </View>

          {/* Booking Success Message */}
          <Text style={styles.title}>Booking Successful! 🎉</Text>
          <Text style={styles.message}>Your booking request has been sent to the service provider. You will be notified once they accept.</Text>

          {/* Button to Navigate to Home */}
          <Button title="Go to Home" onPress={handleGoHome} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default BookingSuccessScreen;
