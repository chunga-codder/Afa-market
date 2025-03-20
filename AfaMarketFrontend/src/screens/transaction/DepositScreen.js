import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { depositFunds } from '../../services/paymentService'; // Assuming you have a service function for deposit

const DepositScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobileMoney');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount) {
      alert('Please enter an amount to deposit');
      return;
    }

    setLoading(true);
    try {
      await depositFunds(amount, paymentMethod);
      alert('Deposit successful');
      navigation.goBack();
    } catch (error) {
      alert('Error during deposit: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Select Payment Method</Text>
      <Button title="MTN Mobile Money" onPress={() => setPaymentMethod('mobileMoney')} />
      <Button title="Orange Mobile Money" onPress={() => setPaymentMethod('orangeMoney')} />
      <Button title="Flutterwave" onPress={() => setPaymentMethod('flutterwave')} />

      <Button
        title={loading ? "Processing..." : "Deposit"}
        onPress={handleDeposit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, padding: 10 },
  label: { fontSize: 18, marginBottom: 10 },
});

export default DepositScreen;
