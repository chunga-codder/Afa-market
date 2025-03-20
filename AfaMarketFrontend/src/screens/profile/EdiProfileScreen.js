import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProfileHeader from '../components/ProfileHeader'; // Import ProfileHeader
import Avatar from '../components/Avatar'; // Import Avatar Component
import CustomButton from '../components/CustomButton'; // Import Custom Button Component

const EditProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);  // Getting user data from Redux store
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    profilePhoto: '',
    averageRating: 4.5, // Default example rating
    minPrice: 100, // Default min price
    maxPrice: 150, // Default max price
    isNegotiable: true, // Default negotiable option
  });

  useEffect(() => {
    // Fetch current profile info to pre-populate the form
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProfile({
          fullName: response.data.user.fullName,
          phone: response.data.user.phone,
          profilePhoto: response.data.user.profilePhoto,
          averageRating: response.data.user.averageRating || 4.5,
          minPrice: response.data.user.minPrice || 100,
          maxPrice: response.data.user.maxPrice || 150,
          isNegotiable: response.data.user.isNegotiable || true,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user.token]);

  const handleSave = async () => {
    try {
      const updatedProfile = {
        fullName: profile.fullName,
        phone: profile.phone,
        minPrice: profile.minPrice,
        maxPrice: profile.maxPrice,
        isNegotiable: profile.isNegotiable,
      };
      await axios.patch('http://localhost:5000/api/users/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();  // Go back after saving changes
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Header with Avatar */}
      <ProfileHeader user={profile}>
        <Avatar imageUrl={profile.profilePhoto} size={80} />
      </ProfileHeader>

      {/* Input Fields */}
      <TextInput
        placeholder="Full Name"
        value={profile.fullName}
        onChangeText={(text) => setProfile({ ...profile, fullName: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={profile.phone}
        onChangeText={(text) => setProfile({ ...profile, phone: text })}
        style={styles.input}
      />

      {/* Service Pricing Section */}
      <Text style={styles.label}>Service Price Range:</Text>
      <TextInput
        placeholder="Min Price"
        keyboardType="numeric"
        value={profile.minPrice.toString()}
        onChangeText={(text) => setProfile({ ...profile, minPrice: parseInt(text) })}
        style={styles.input}
      />
      <TextInput
        placeholder="Max Price"
        keyboardType="numeric"
        value={profile.maxPrice.toString()}
        onChangeText={(text) => setProfile({ ...profile, maxPrice: parseInt(text) })}
        style={styles.input}
      />

      {/* Negotiable Option */}
      <View style={styles.negotiableContainer}>
        <Text style={styles.label}>Price Negotiable:</Text>
        <CustomButton
          title={profile.isNegotiable ? 'Yes, Price is Negotiable' : 'No, Price is Fixed'}
          onPress={() => setProfile({ ...profile, isNegotiable: !profile.isNegotiable })}
        />
      </View>

      {/* Save Button */}
      <CustomButton title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  negotiableContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
});

export default EditProfileScreen;
