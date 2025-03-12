import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { withdrawFunds } from '../../services/transactionService';

const WithdrawScreen = () => {
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    const success = await withdrawFunds(amount);
    if (success) {
      alert('Withdraw successful');
    } else {
      alert('Withdraw failed');
    }
  };

  return (
    <View>
      <Text>Withdraw Funds</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />
      <Button title="Withdraw" onPress={handleWithdraw} />
    </View>
  );
};

export default WithdrawScreen;
