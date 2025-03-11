import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { depositFunds } from '../../services/transactionService';

const DepositScreen = () => {
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    const success = await depositFunds(amount);
    if (success) {
      alert('Deposit successful');
    } else {
      alert('Deposit failed');
    }
  };

  return (
    <View>
      <Text>Deposit Funds</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />
      <Button title="Deposit" onPress={handleDeposit} />
    </View>
  );
};

export default DepositScreen;
