import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import { approveTransaction, rejectTransaction, freezeUnfreezeUser, listAllAdmins, getActivityLogs } from "../../services/adminService";

const AdminDashboardScreen = () => {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchAdmins();
    fetchLogs();
  }, []);

  const fetchAdmins = async () => {
    const response = await listAllAdmins();
    if (response) setAdmins(response);
  };

  const fetchLogs = async () => {
    const response = await getActivityLogs();
    if (response) setLogs(response);
  };

  const handleApproveTransaction = async (transactionId) => {
    const success = await approveTransaction(transactionId);
    if (success) {
      Alert.alert("Success", "Transaction approved!");
    } else {
      Alert.alert("Error", "Failed to approve transaction.");
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    const success = await rejectTransaction(transactionId);
    if (success) {
      Alert.alert("Success", "Transaction rejected!");
    } else {
      Alert.alert("Error", "Failed to reject transaction.");
    }
  };

  const handleFreezeUnfreeze = async (userId) => {
    const success = await freezeUnfreezeUser(userId);
    if (success) {
      Alert.alert("Success", "User status updated.");
    } else {
      Alert.alert("Error", "Failed to update user status.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      {/* Transaction Actions */}
      <Button title="Approve Transaction" onPress={() => handleApproveTransaction("TRANSACTION_ID")} />
      <Button title="Reject Transaction" onPress={() => handleRejectTransaction("TRANSACTION_ID")} />

      {/* Freeze/Unfreeze Account */}
      <Button title="Freeze/Unfreeze User" onPress={() => handleFreezeUnfreeze("USER_ID")} />

      {/* List of Admins */}
      <Text style={styles.subHeading}>Admins:</Text>
      <FlatList
        data={admins}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />

      {/* Activity Logs */}
      <Text style={styles.subHeading}>Activity Logs:</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.action}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subHeading: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
});

export default AdminDashboardScreen;
