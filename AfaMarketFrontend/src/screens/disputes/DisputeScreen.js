// src/screens/disputes/DisputeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { createDispute, getDisputes, sendMessageInDispute, resolveDispute, closeDispute } from "../../services/disputeService";

const DisputeScreen = () => {
  const [transactionId, setTransactionId] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Assume role check comes from authentication

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    const data = await getDisputes();
    setDisputes(data);
  };

  const handleCreateDispute = async () => {
    if (!transactionId.trim() || !reason.trim()) {
      Alert.alert("Error", "Please enter a transaction ID and reason.");
      return;
    }

    const success = await createDispute(transactionId, reason);
    if (success) {
      Alert.alert("Success", "Dispute created successfully.");
      setTransactionId("");
      setReason("");
      fetchDisputes();
    } else {
      Alert.alert("Error", "Failed to create dispute.");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedDispute || !message.trim()) {
      Alert.alert("Error", "Select a dispute and enter a message.");
      return;
    }

    const success = await sendMessageInDispute(selectedDispute.id, message);
    if (success) {
      Alert.alert("Success", "Message sent.");
      setMessage("");
    } else {
      Alert.alert("Error", "Failed to send message.");
    }
  };

  const handleResolveDispute = async (disputeId) => {
    if (!isAdmin) {
      Alert.alert("Error", "Only admins can resolve disputes.");
      return;
    }

    const success = await resolveDispute(disputeId);
    if (success) {
      Alert.alert("Success", "Dispute resolved.");
      fetchDisputes();
    } else {
      Alert.alert("Error", "Failed to resolve dispute.");
    }
  };

  const handleCloseDispute = async (disputeId) => {
    if (!isAdmin) {
      Alert.alert("Error", "Only admins can close disputes.");
      return;
    }

    const success = await closeDispute(disputeId);
    if (success) {
      Alert.alert("Success", "Dispute closed.");
      fetchDisputes();
    } else {
      Alert.alert("Error", "Failed to close dispute.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Dispute Management</Text>

      {/* Create Dispute Form */}
      <TextInput placeholder="Transaction ID" value={transactionId} onChangeText={setTransactionId} style={styles.input} />
      <TextInput placeholder="Reason" value={reason} onChangeText={setReason} style={styles.input} />
      <Button title="Create Dispute" onPress={handleCreateDispute} />

      {/* List of Disputes */}
      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>Disputes</Text>
      <FlatList
        data={disputes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.disputeItem} onPress={() => setSelectedDispute(item)}>
            <Text style={{ fontWeight: "bold" }}>Dispute #{item.id}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Reason: {item.reason}</Text>
            {isAdmin && (
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Button title="Resolve" onPress={() => handleResolveDispute(item.id)} />
                <Button title="Close" color="red" onPress={() => handleCloseDispute(item.id)} />
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Chat Section for Selected Dispute */}
      {selectedDispute && (
        <View style={styles.chatSection}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Chat in Dispute #{selectedDispute.id}</Text>
          <FlatList
            data={selectedDispute.messages || []}
            keyExtractor={(msg, index) => index.toString()}
            renderItem={({ item }) => <Text>{item.sender}: {item.text}</Text>}
          />
          <TextInput placeholder="Type your message..." value={message} onChangeText={setMessage} style={styles.input} />
          <Button title="Send Message" onPress={handleSendMessage} />
        </View>
      )}
    </ScrollView>
  );
};

// Styles
const styles = {
  input: { borderColor: "gray", borderWidth: 1, padding: 10, marginVertical: 10 },
  disputeItem: { borderBottomWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5 },
  chatSection: { marginTop: 20, padding: 10, borderColor: "gray", borderWidth: 1 },
};

export default DisputeScreen;
