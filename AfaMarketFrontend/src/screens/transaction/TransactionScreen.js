import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Assuming axios is being used for API requests
import { depositFunds, withdrawFunds, transferFunds, getTransactionHistory } from '../../services/transactionService'; // Assuming the service is available

const TransactionScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0); // For balance display
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadUserData();
    loadTransactionHistory();

    return () => {
      // Cleanup if necessary (e.g., close websockets)
    };
  }, []);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    setUserId(storedUserId);
    
    // Fetch balance data
    fetchBalance(storedUserId);
  };

  // Function to fetch balance data
  const fetchBalance = async (userId) => {
    try {
      const response = await axios.get(`https://your-api-url.com/user/${userId}/balance`);
      setBalance(response.data.balance); // Assuming response has balance field
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Load transaction history
  const loadTransactionHistory = async () => {
    try {
      const history = await getTransactionHistory(userId); // Pass userId if needed
      setTransactions(history);
    } catch (error) {
      console.error('Failed to load transaction history', error);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    if (amount) {
      const success = await depositFunds(amount);
      if (success) {
        setBalance((prev) => prev + parseFloat(amount));
        alert('Deposit successful');
      } else {
        alert('Deposit failed');
      }
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (amount) {
      const success = await withdrawFunds(amount);
      if (success) {
        setBalance((prev) => prev - parseFloat(amount));
        alert('Withdrawal successful');
      } else {
        alert('Withdrawal failed');
      }
    }
  };

  // Handle transfer
  const handleTransfer = async (receiverId) => {
    if (amount) {
      const success = await transferFunds(receiverId, amount);
      if (success) {
        alert('Transfer successful');
        // Optionally, reload transaction history or update balance
      } else {
        alert('Transfer failed');
      }
    }
  };

  // Render profile header
  const renderProfileHeader = () => {
    return (
      <View style={styles.header}>
        <Image source={{ uri: 'path-to-your-avatar' }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>User Name</Text>
          <Text style={styles.profileBalance}>Balance: {balance}</Text>
        </View>
      </View>
    );
  };

  // Render transaction history
  const renderTransactionHistory = () => {
    return (
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.type} - {item.amount}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderProfileHeader()}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.buttonsContainer}>
          <Button title="Deposit" onPress={handleDeposit} />
          <Button title="Withdraw" onPress={handleWithdraw} />
          <Button title="Transfer" onPress={() => handleTransfer(userId)} />
        </View>
      </View>
      <Text style={styles.transactionHistoryTitle}>Transaction History</Text>
      {renderTransactionHistory()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileBalance: {
    fontSize: 16,
    color: 'green',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transactionHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default TransactionScreen;
