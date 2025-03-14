import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Clipboard from "expo-clipboard"; // Use expo-clipboard
import axios from "axios";

const ReferralScreen = ({ userId }) => {
  const [earnings, setEarnings] = useState(0);
  const referralCode = userId; // Use userId as referral code

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`https://localhost:5000/api/referral/earnings/${userId}`);
      setEarnings(response.data.referralEarnings);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    alert("Referral code copied!");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Your Referral Code</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>{referralCode}</Text>
      <Button title="Copy Code" onPress={copyToClipboard} />

      <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 20 }}>Your Earnings</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>${earnings.toFixed(2)}</Text>
    </View>
  );
};

export default ReferralScreen;
