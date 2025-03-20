import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { transferFunds } from '../../services/paymentService'; // Service function for transferring funds

const TransferScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!amount || !recipientId) {
      alert('Please enter the amount and recipient ID');
      return;
    }

    setLoading(true);
    try {
      await transferFunds(amount, recipientId);
      alert('Transfer successful');
      navigation.goBack();
    } catch (error) {
      alert('Error during transfer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Funds</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter recipient ID"
        value={recipientId}
        onChangeText={setRecipientId}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button
        title={loading ? "Processing..." : "Transfer"}
        onPress={handleTransfer}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, padding: 10 },
});

export default TransferScreen;
