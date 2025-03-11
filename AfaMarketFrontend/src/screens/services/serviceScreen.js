import React from 'react';
import { View, Text, Button } from 'react-native';
import { depositFunds, withdrawFunds, transferFunds, completeEscrow, rateTransaction } from '../../services/transactionService';

const ServiceScreen = () => {
  const handleDeposit = async () => {
    const success = await depositFunds(100);
    if (success) {
      alert('Deposit successful');
    } else {
      alert('Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    const success = await withdrawFunds(50);
    if (success) {
      alert('Withdrawal successful');
    } else {
      alert('Withdrawal failed');
    }
  };

  const handleTransfer = async () => {
    const success = await transferFunds(30, 'recipientId');
    if (success) {
      alert('Transfer successful');
    } else {
      alert('Transfer failed');
    }
  };

  const handleCompleteEscrow = async () => {
    const success = await completeEscrow('escrowId');
    if (success) {
      alert('Escrow completed');
    } else {
      alert('Escrow completion failed');
    }
  };

  const handleRateTransaction = async () => {
    const success = await rateTransaction('transactionId', 5);
    if (success) {
      alert('Transaction rated');
    } else {
      alert('Rating failed');
    }
  };

  return (
    <View>
      <Text>Service Screen</Text>
      <Button title="Deposit Funds" onPress={handleDeposit} />
      <Button title="Withdraw Funds" onPress={handleWithdraw} />
      <Button title="Transfer Funds" onPress={handleTransfer} />
      <Button title="Complete Escrow" onPress={handleCompleteEscrow} />
      <Button title="Rate Transaction" onPress={handleRateTransaction} />
    </View>
  );
};

export default ServiceScreen;
