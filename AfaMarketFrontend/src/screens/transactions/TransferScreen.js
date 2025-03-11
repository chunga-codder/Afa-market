import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { transferFunds } from '../../services/transactionService';

const TransferScreen = () => {
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    const success = await transferFunds(receiverId, amount);
    if (success) {
      alert('Transfer successful');
    } else {
      alert('Transfer failed');
    }
  };

  return (
    <View>
      <Text>Transfer Funds</Text>
      <TextInput
        value={receiverId}
        onChangeText={setReceiverId}
        placeholder="Receiver ID"
      />
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <Button title="Transfer" onPress={handleTransfer} />
    </View>
  );
};

export default TransferScreen;
