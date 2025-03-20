import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ProfileHeader from './ProfileHeader'; // Import ProfileHeader component

const ServiceDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { category, user } = route.params; // Get the category and user (service provider) passed from previous screen

  const [finalPrice, setFinalPrice] = useState(category.maxPrice);
  const [negotiatedPrice, setNegotiatedPrice] = useState(null); // Store negotiated price

  // Handle price negotiation
  const handleNegotiate = () => {
    // Open the chat screen to negotiate price
    navigation.navigate('ChatScreen', { recipientId: user.id }); // Passing the recipientId (service provider) for chat
  };

  const renderServiceDetails = () => {
    switch (category.name) {
      case 'Water Supply':
        return (
          <View>
            <Text style={styles.detailText}>Service Description:</Text>
            <Text style={styles.descriptionText}>
              Reliable and efficient water supply services for homes and businesses.
            </Text>
            <Text style={styles.detailText}>Price Range: CFA 500 - CFA 2,000</Text>
            <Text style={styles.detailText}>Available Providers: 20</Text>
          </View>
        );
      case 'Moving and Transfer Assistant':
        return (
          <View>
            <Text style={styles.detailText}>Service Description:</Text>
            <Text style={styles.descriptionText}>
              Professional moving and transfer assistance for homes, offices, and businesses.
            </Text>
            <Text style={styles.detailText}>Price Range: CFA 2,000 - CFA 10,000</Text>
            <Text style={styles.detailText}>Available Providers: 10</Text>
          </View>
        );
      case 'Plumbing Services':
        return (
          <View>
            <Text style={styles.detailText}>Service Description:</Text>
            <Text style={styles.descriptionText}>
              Plumbing services for residential and commercial buildings. Fix leaks, install pipes, and more.
            </Text>
            <Text style={styles.detailText}>Price Range: CFA 3,000 - CFA 15,000</Text>
            <Text style={styles.detailText}>Available Providers: 15</Text>
          </View>
        );
      // Add other categories...
      default:
        return <Text>No details available for this category.</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Display Profile Header */}
      <ProfileHeader user={user} />

      <Text style={styles.title}>{category.name}</Text>
      {renderServiceDetails()}

      {/* Display current or negotiated price */}
      <Text style={styles.priceText}>Price: CFA {finalPrice}</Text>

      {/* Display button for price negotiation */}
      {category.isNegotiable && (
        <Button title="Negotiate Price" onPress={handleNegotiate} />
      )}

      {/* Navigate to booking screen */}
      <Button
        title="Request Service"
        onPress={() => {
          // Navigate to booking screen or service request form
          navigation.navigate('BookingScreen', { category, finalPrice });
        }}
      />
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
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    color: '#555',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
});

export default ServiceDetailsScreen;
