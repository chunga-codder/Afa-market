// src/screens/wallet/WalletScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import {
  getWalletBalance,
  depositFunds,
  withdrawFunds,
  transferFunds,
  releaseEscrow,
  raiseDispute,
  resolveDispute,
} from '../../services/walletService';

const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [token, setToken] = useState(''); // Add a way to get or pass the user's token

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const balanceData = await getWalletBalance(token);
      setBalance(balanceData.balance);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch wallet balance');
    }
  };

  const handleDeposit = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount to deposit');
      return;
    }
    try {
      await depositFunds(amount, token);
      loadBalance();
      Alert.alert('Success', 'Funds deposited successfully');
    } catch (error) {
      Alert.alert('Error', 'Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    if (!amount || amount > balance) {
      Alert.alert('Error', 'Insufficient funds or invalid amount');
      return;
    }
    try {
      await withdrawFunds(amount, token);
      loadBalance();
      Alert.alert('Success', 'Withdrawal successful');
    } catch (error) {
      Alert.alert('Error', 'Withdrawal failed');
    }
  };

  const handleTransfer = async () => {
    if (!recipientId || !amount) {
      Alert.alert('Error', 'Please enter recipient ID and amount');
      return;
    }
    try {
      await transferFunds(recipientId, amount, token);
      loadBalance();
      Alert.alert('Success', 'Funds transferred successfully');
    } catch (error) {
      Alert.alert('Error', 'Transfer failed');
    }
  };

  const handleReleaseEscrow = async () => {
    if (!transactionId) {
      Alert.alert('Error', 'Please enter a transaction ID');
      return;
    }
    try {
      await releaseEscrow(transactionId, token);
      loadBalance();
      Alert.alert('Success', 'Escrow released successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to release escrow');
    }
  };

  const handleRaiseDispute = async () => {
    if (!transactionId || !disputeReason) {
      Alert.alert('Error', 'Please enter transaction ID and dispute reason');
      return;
    }
    try {
      await raiseDispute(transactionId, disputeReason, token);
      Alert.alert('Success', 'Dispute raised successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to raise dispute');
    }
  };

  const handleResolveDispute = async () => {
    if (!transactionId) {
      Alert.alert('Error', 'Please enter dispute ID');
      return;
    }
    try {
      await resolveDispute(transactionId, 'resolved', token); // 'resolved' or 'rejected' can be the resolution
      Alert.alert('Success', 'Dispute resolved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve dispute');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Wallet</Text>
      <Text>Balance: ${balance}</Text>

      <TextInput
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
      />
      <Button title="Deposit" onPress={handleDeposit} />
      <Button title="Withdraw" onPress={handleWithdraw} style={{ marginTop: 10 }} />
      
      <TextInput
        placeholder="Recipient ID"
        value={recipientId}
        onChangeText={setRecipientId}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingLeft: 8 }}
      />
      <Button title="Transfer" onPress={handleTransfer} style={{ marginTop: 10 }} />

      <TextInput
        placeholder="Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingLeft: 8 }}
      />
      <Button title="Release Escrow" onPress={handleReleaseEscrow} style={{ marginTop: 10 }} />

      <TextInput
        placeholder="Dispute Reason"
        value={disputeReason}
        onChangeText={setDisputeReason}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingLeft: 8 }}
      />
      <Button title="Raise Dispute" onPress={handleRaiseDispute} style={{ marginTop: 10 }} />
      
      <Button title="Resolve Dispute" onPress={handleResolveDispute} style={{ marginTop: 10 }} />
    </View>
  );
};

export default WalletScreen;

