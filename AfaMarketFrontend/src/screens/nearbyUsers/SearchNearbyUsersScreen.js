import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { searchNearbyUsers } from '../../services/nearbyUserService';
import * as Location from 'expo-location';  // To get user's current location

const SearchNearbyUsersScreen = () => {
  const [location, setLocation] = useState(null);
  const [usersNearby, setUsersNearby] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchNearbyUsers(location.coords.latitude, location.coords.longitude);
    };

    getLocation();
  }, []);

  const fetchNearbyUsers = async (latitude, longitude) => {
    setLoading(true);
    try {
      const data = await searchNearbyUsers(latitude, longitude);
      setUsersNearby(data.usersNearby);  // This contains nearby users from the backend
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>Name: {item.name}</Text>
      <Text style={styles.userText}>Location: {item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Service Providers</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={usersNearby}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
  },
});

export default SearchNearbyUsersScreen;
