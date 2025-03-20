import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '../components/ProfileHeader'; // Import ProfileHeader
import Avatar from '../components/Avatar'; // Import Avatar Component
import CustomButton from '../components/CustomButton'; // Import Custom Button Component

const ProfileScreen = ({ navigation, userId }) => {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+123456789',
    profilePhoto: null, // Default profile photo
    averageRating: 4.5, // Example rating
    minPrice: 100, // Example min price
    maxPrice: 150, // Example max price
    isNegotiable: true, // Example negotiable option
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
      setProfile({ ...profile, profilePhoto: result.uri });
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
      {/* Profile Header with Avatar */}
      <ProfileHeader user={profile}>
        <Avatar imageUrl={profile.profilePhoto} size={100} />
      </ProfileHeader>

      {/* Profile Photo Section */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profile.profilePhoto ? { uri: profile.profilePhoto } : require('../../assets/default-avatar.png')}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {/* User Info */}
      <Text style={styles.label}>Email:</Text>
      <Text>{profile.email}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text>{profile.phone}</Text>

      {/* Referral Code Section */}
      <Text style={styles.label}>Your Referral Code:</Text>
      <Text style={styles.referralCode}>{userId}</Text>
      <CustomButton title="Invite Friends" onPress={() => shareReferralCode(userId)} />

      {/* Navigation Buttons */}
      <CustomButton title="Edit Profile" onPress={() => navigation.navigate('UpdateProfile')} />
      <CustomButton title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      <CustomButton title="Update KYC" onPress={() => navigation.navigate('KYCUpdate')} color="green" />

      {/* Service Price Range & Negotiable Option */}
      <UserProfileScreen user={profile} />
    </View>
  );
};

// Profile screen for Service Providers (Service Price Range and Negotiable Option)
const UserProfileScreen = ({ user }) => {
  return (
    <View style={styles.userProfileSection}>
      <Text style={styles.priceLabel}>Service Price Range: ${user.minPrice} - ${user.maxPrice}</Text>
      <Text>{user.isNegotiable ? 'Price is negotiable' : 'Price is fixed'}</Text>
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
  userProfileSection: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
  },
  priceLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
