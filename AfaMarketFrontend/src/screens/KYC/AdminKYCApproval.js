import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import KYCService from '../services/kycService';

const AdminKYCApproval = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users awaiting KYC approval
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/kyc-pending'); // Adjust API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const approveKYC = async (userId) => {
    try {
      await KYCService.approveKYC({ userId });
      Alert.alert('Success', 'KYC Approved');
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      Alert.alert('Error', 'Approval failed');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Pending KYC Approvals:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.fullName}</Text>
            <Button title="Approve" onPress={() => approveKYC(item._id)} />
          </View>
        )}
      />
    </View>
  );
};

export default AdminKYCApproval;

