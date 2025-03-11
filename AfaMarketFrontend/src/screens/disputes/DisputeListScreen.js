// src/screens/disputes/DisputeListScreen.js

import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { getDisputes } from "../../services/disputeService";

const DisputeListScreen = ({ navigation }) => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    const fetchDisputes = async () => {
      const fetchedDisputes = await getDisputes();
      setDisputes(fetchedDisputes);
    };
    
    fetchDisputes();
  }, []);

  const handleViewDetails = (dispute) => {
    // Navigate to DisputeDetailsScreen and pass dispute data
    navigation.navigate("DisputeDetails", { dispute });
  };

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Disputes List</Text>
      
      <FlatList
        data={disputes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewDetails(item)}>
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text>{item.reason}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DisputeListScreen;
