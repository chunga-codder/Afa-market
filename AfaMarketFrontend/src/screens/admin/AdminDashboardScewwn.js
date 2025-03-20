import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, ScrollView } from "react-native";
import { approveTransaction, rejectTransaction, freezeUnfreezeUser, listAllAdmins, getActivityLogs } from "../../services/adminService";
import ProfileHeader from "../components/ProfileHeader"; // Import ProfileHeader Component
import Avatar from "../components/Avatar"; // Import Avatar Component
import { useSelector } from "react-redux"; // To access the logged-in user's information
import Button from "../components/Button"; // Import the Button component

const AdminDashboardScreen = () => {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);
  const { user } = useSelector((state) => state.auth); // Access user info from Redux

  useEffect(() => {
    fetchAdmins();
    fetchLogs();
  }, []);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const response = await listAllAdmins();
      if (response) setAdmins(response);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch admins.");
    }
  };

  // Fetch all activity logs
  const fetchLogs = async () => {
    try {
      const response = await getActivityLogs();
      if (response) setLogs(response);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch activity logs.");
    }
  };

  // Handle approve transaction
  const handleApproveTransaction = async (transactionId) => {
    try {
      const success = await approveTransaction(transactionId);
      if (success) {
        Alert.alert("Success", "Transaction approved!");
      } else {
        Alert.alert("Error", "Failed to approve transaction.");
      }
    } catch (error) {
      Alert.alert("Error", "Error approving transaction.");
    }
  };

  // Handle reject transaction
  const handleRejectTransaction = async (transactionId) => {
    try {
      const success = await rejectTransaction(transactionId);
      if (success) {
        Alert.alert("Success", "Transaction rejected!");
      } else {
        Alert.alert("Error", "Failed to reject transaction.");
      }
    } catch (error) {
      Alert.alert("Error", "Error rejecting transaction.");
    }
  };

  // Handle freeze/unfreeze user
  const handleFreezeUnfreeze = async (userId) => {
    try {
      const success = await freezeUnfreezeUser(userId);
      if (success) {
        Alert.alert("Success", "User status updated.");
      } else {
        Alert.alert("Error", "Failed to update user status.");
      }
    } catch (error) {
      Alert.alert("Error", "Error updating user status.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header with Avatar */}
      <ProfileHeader user={user}>
        <Avatar imageUrl={user.profilePhoto} size={80} />
      </ProfileHeader>

      <Text style={styles.heading}>Admin Dashboard</Text>

      {/* Transaction Actions */}
      <View style={styles.buttonContainer}>
        <Button
          title="Approve Transaction"
          onPress={() => handleApproveTransaction("TRANSACTION_ID")}
        />
        <Button
          title="Reject Transaction"
          onPress={() => handleRejectTransaction("TRANSACTION_ID")}
        />
      </View>

      {/* Freeze/Unfreeze Account */}
      <View style={styles.buttonContainer}>
        <Button
          title="Freeze/Unfreeze User"
          onPress={() => handleFreezeUnfreeze("USER_ID")}
        />
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subHeading: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  buttonContainer: { marginBottom: 10 },
});

export default AdminDashboardScreen;
