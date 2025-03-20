import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { resetPassword } from '../../services/passwordResetService'; // Import the password reset service

const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);

    const result = await resetPassword(email); // Call the password reset service

    setLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message);
      navigation.navigate('Login'); // Navigate to the Login screen after a successful reset
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <Button 
        title={loading ? 'Sending...' : 'Send Reset Link'} 
        onPress={handlePasswordReset} 
        disabled={loading} 
      />
      
      <View style={styles.footer}>
        <Text>Remember your password?</Text>
        <Button title="Go Back to Login" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default PasswordResetScreen;
