import React, { useState } from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { submitKYC } from "../services/kycService";

const KYCUpdateScreen = ({ navigation }) => {
  const [idCard, setIdCard] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!idCard || !selfie) {
      alert("Please upload both ID Card and Selfie.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await submitKYC({ documentImage: idCard, selfieImage: selfie });
      if (response.status === 200) {
        alert("KYC submitted. Please wait for admin approval.");
        await AsyncStorage.setItem("kycStatus", "pending"); // Update local storage
        navigation.replace("Auth"); // Send user back to login
      }
    } catch (error) {
      alert("Failed to submit KYC. Try again.");
    }
    setLoading(false);
  };

  return (
    <View>
      <Text>KYC Verification Required</Text>
      <TouchableOpacity onPress={() => pickImage(setIdCard)}>
        {idCard ? <Image source={{ uri: idCard }} style={{ width: 100, height: 100 }} /> : <Text>Upload ID Card</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => pickImage(setSelfie)}>
        {selfie ? <Image source={{ uri: selfie }} style={{ width: 100, height: 100 }} /> : <Text>Upload Selfie</Text>}
      </TouchableOpacity>

      <Button title={loading ? "Submitting..." : "Submit KYC"} onPress={handleSubmit} />
    </View>
  );
};

export default KYCUpdateScreen;
