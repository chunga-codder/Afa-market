import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { getTransactionHistory } from '../services/transactionService'; // A service to fetch the transaction history from the API

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await getTransactionHistory();
      setTransactions(response.data);
    };

    fetchTransactions();
  }, []);

  return (
    <View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.transactionId}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Transaction Type: {item.transactionType}</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TransactionHistory;
