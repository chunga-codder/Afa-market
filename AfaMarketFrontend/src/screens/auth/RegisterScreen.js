// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { registerUser } from '../../services/authService';
import * as ImagePicker from 'expo-image-picker'; // If you're using Expo
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // If you're using React Native CLI

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idCard, setIdCard] = useState(null);  // For KYC ID card
  const [faceImage, setFaceImage] = useState(null);  // For facial recognition

  // Handle ID Card Image Picking (use Camera or Gallery)
  const pickIdCardImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.assets) {
        setIdCard(response.assets[0].uri);
      } else {
        Alert.alert('Error', 'Please select an ID card image');
      }
    });
  };

  // Handle Facial Recognition Image (Take Picture via Camera)
  const takeFacePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.assets) {
        setFaceImage(response.assets[0].uri);
      } else {
        Alert.alert('Error', 'Please take a face photo for KYC');
      }
    });
  };

  // Handle Registration with KYC
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!idCard || !faceImage) {
      Alert.alert('Error', 'Please complete KYC by uploading your ID card and face photo');
      return;
    }

    try {
      const userData = {
        email,
        password,
        idCardImage: idCard,
        faceImage: faceImage,
      };
      const response = await registerUser(userData);
      if (response.success) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
      />

      {/* ID Card Upload */}
      <View style={{ marginBottom: 20 }}>
        <Text>Upload ID Card (for KYC)</Text>
        <TouchableOpacity onPress={pickIdCardImage} style={{ marginTop: 10, backgroundColor: 'blue', padding: 10 }}>
          <Text style={{ color: 'white' }}>Pick ID Card Image</Text>
        </TouchableOpacity>
        {idCard && (
          <Image
            source={{ uri: idCard }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        )}
      </View>

      {/* Face Image for Facial Recognition */}
      <View style={{ marginBottom: 20 }}>
        <Text>Take a Photo for Facial Recognition (for KYC)</Text>
        <TouchableOpacity onPress={takeFacePhoto} style={{ marginTop: 10, backgroundColor: 'green', padding: 10 }}>
          <Text style={{ color: 'white' }}>Take Face Photo</Text>
        </TouchableOpacity>
        {faceImage && (
          <Image
            source={{ uri: faceImage }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        )}
      </View>

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
