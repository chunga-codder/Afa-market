import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import KYCService from '../services/kycService';

const KYCVerification = ({ navigation }) => {
  const [documentType, setDocumentType] = useState('');
  const [idCardImage, setIdCardImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const submitKYC = async () => {
    if (!documentType || !idCardImage || !selfieImage) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('documentImage', {
      uri: idCardImage,
      type: 'image/jpeg',
      name: 'id_card.jpg',
    });
    formData.append('selfieImage', {
      uri: selfieImage,
      type: 'image/jpeg',
      name: 'selfie.jpg',
    });

    try {
      await KYCService.submitKYC(formData);
      Alert.alert('Success', 'KYC submitted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select Document Type:</Text>
      <TextInput
        placeholder="ID Card / Passport / Driver License"
        value={documentType}
        onChangeText={setDocumentType}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />

      <TouchableOpacity onPress={() => pickImage(setIdCardImage)}>
        <Text>Upload ID Card</Text>
        {idCardImage && <Image source={{ uri: idCardImage }} style={{ width: 100, height: 100 }} />}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => pickImage(setSelfieImage)}>
        <Text>Upload Selfie</Text>
        {selfieImage && <Image source={{ uri: selfieImage }} style={{ width: 100, height: 100 }} />}
      </TouchableOpacity>

      <Button title="Submit KYC" onPress={submitKYC} />
    </View>
  );
};

export default KYCVerification;
