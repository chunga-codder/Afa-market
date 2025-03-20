import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProfileHeader from '../components/ProfileHeader'; // Import ProfileHeader
import Avatar from '../components/Avatar'; // Import Avatar Component
import CustomButton from '../components/CustomButton'; // Import Custom Button Component

const UploadProfilePhotoScreen = () => {
  const { user } = useSelector(state => state.auth); // Get user data from Redux store
  const [photo, setPhoto] = useState(user.profilePhoto || null);

  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Function to handle saving the image
  const handleSaveImage = async () => {
    if (!photo) {
      alert('Please select a photo!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePhoto', {
        uri: photo,
        type: 'image/jpeg',
        name: 'profile-photo.jpg',
      });

      await axios.patch('http://localhost:5000/api/users/profile-photo', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      Alert.alert('Error', 'Failed to upload profile photo.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Header with Avatar */}
      <ProfileHeader user={{ 
        profilePhoto: photo || user.profilePhoto, 
        fullName: user.fullName, 
        averageRating: user.averageRating || 4.5 
      }}>
        <Avatar imageUrl={photo || user.profilePhoto} size={100} />
      </ProfileHeader>

      <Text style={styles.title}>Upload Profile Photo</Text>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <Text>No photo selected</Text>
      )}

      {/* Custom Buttons */}
      <CustomButton title="Pick an Image" onPress={pickImage} />
      <CustomButton title="Save Profile Photo" onPress={handleSaveImage} color="green" />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});

export default UploadProfilePhotoScreen;
