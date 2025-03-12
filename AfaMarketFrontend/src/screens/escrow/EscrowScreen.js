// src/screens/escrow/EscrowScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { createEscrow, releaseEscrow, createDispute, resolveDispute, getEscrows } from '../../services/escrowService';

const EscrowScreen = () => {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [escrowId, setEscrowId] = useState('');

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    const escrowData = await getEscrows();
    setEscrows(escrowData);
    setLoading(false);
  };

  const handleCreateEscrow = async () => {
    if (!transactionId || !amount) {
      alert('Please provide transaction ID and amount.');
      return;
    }

    const success = await createEscrow(transactionId, parseFloat(amount));
    if (success) {
      fetchEscrows();
    } else {
      alert('Failed to create escrow');
    }
  };

  const handleReleaseEscrow = async (escrowId) => {
    const success = await releaseEscrow(escrowId);
    if (success) {
      fetchEscrows();
    } else {
      alert('Failed to release escrow');
    }
  };

  const handleCreateDispute = async () => {
    if (!disputeReason || !escrowId) {
      alert('Please provide dispute reason and select an escrow.');
      return;
    }

    const success = await createDispute(escrowId, disputeReason);
    if (success) {
      fetchEscrows();
    } else {
      alert('Failed to create dispute');
    }
  };

  const handleResolveDispute = async (escrowId) => {
    const success = await resolveDispute(escrowId);
    if (success) {
      fetchEscrows();
    } else {
      alert('Failed to resolve dispute');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={escrows}
          renderItem={({ item }) => (
            <View style={styles.escrowItem}>
              <Text>Escrow ID: {item._id}</Text>
              <Text>Amount: ${item.amount}</Text>
              <Button title="Release Escrow" onPress={() => handleReleaseEscrow(item._id)} />
              <Button title="Resolve Dispute" onPress={() => handleResolveDispute(item._id)} />
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <Button title="Create New Escrow" onPress={handleCreateEscrow} />

      <TextInput
        style={styles.input}
        placeholder="Dispute Reason"
        value={disputeReason}
        onChangeText={setDisputeReason}
      />
      <TextInput
        style={styles.input}
        placeholder="Escrow ID to Dispute"
        value={escrowId}
        onChangeText={setEscrowId}
      />
      <Button title="Create Dispute" onPress={handleCreateDispute} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  escrowItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default EscrowScreen;
