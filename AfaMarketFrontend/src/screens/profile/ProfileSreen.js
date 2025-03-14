import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, userId }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+123456789',
    photo: null, // Default profile photo
  });

  useEffect(() => {
    // Fetch user profile from API and update state
    // Example: fetchUserProfile().then(data => setProfile(data));
  }, []);

  // Handle Image Selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, photo: result.uri });
      uploadPhoto(result.uri);
    }
  };

  // Upload Image to Backend
  const uploadPhoto = async (imageUri) => {
    let formData = new FormData();
    formData.append('profilePhoto', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    try {
      const token = await AsyncStorage.getItem('authToken'); // Get auth token
      const response = await fetch('https://your-api.com/api/users/profile/photo', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Profile photo updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile photo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading profile photo');
    }
  };

  // Share Referral Code
  const shareReferralCode = async (referralCode) => {
    try {
      await Share.share({
        message: `Join this amazing platform using my referral code: ${referralCode}! Sign up now!`,
      });
    } catch (error) {
      console.error('Error sharing referral code:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Photo Section */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profile.photo ? { uri: profile.photo } : require('../../assets/default-avatar.png')}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* User Info */}
      <Text style={styles.label}>Name:</Text>
      <Text>{profile?.name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text>{profile?.email}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text>{profile?.phone}</Text>

      {/* Referral Code Section */}
      <Text style={styles.label}>Your Referral Code:</Text>
      <Text style={styles.referralCode}>{userId}</Text>
      <Button title="Invite Friends" onPress={() => shareReferralCode(userId)} />

      {/* Navigation Buttons */}
      <Button title="Edit Profile" onPress={() => navigation.navigate('UpdateProfile')} />
      <Button title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      <Button title="Update KYC" onPress={() => navigation.navigate('KYCUpdate')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  changePhotoText: {
    color: '#007bff',
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
});

export default ProfileScreen;
