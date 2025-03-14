import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  // If using Expo

const UploadProfilePhotoScreen = () => {
  const [photo, setPhoto] = useState(null);

  // Function to handle image picking
  const pickImage = async () => {
    // Request permission for camera roll access if necessary
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Launch image picker and get the selected image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],  // Keep the image aspect ratio square
      quality: 1,  // Max quality
    });

    // If the user selected an image, update the state
    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  // Function to handle saving the image
  const handleSaveImage = async () => {
    if (!photo) {
      alert('Please select a photo!');
      return;
    }
    
    // Here, you would send the image to your backend or update the user's profile
    // For example:
    try {
      const formData = new FormData();
      formData.append('profilePhoto', {
        uri: photo,
        type: 'image/jpeg', // Assuming the image is a JPEG; you can adjust if needed
        name: 'profile-photo.jpg',
      });
      
      // Replace with actual backend endpoint
      await axios.patch('http://localhost:5000/api/users/profile-photo', formData, {
        headers: { Authorization: `Bearer YOUR_USER_TOKEN` },
      });

      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload profile photo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Profile Photo</Text>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <Text>No photo selected</Text>
      )}
      <Button title="Pick an Image" onPress={pickImage} />
      <Button title="Save Profile Photo" onPress={handleSaveImage} />
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
