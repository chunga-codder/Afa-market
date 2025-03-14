import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);  // Getting user data from Redux store
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Fetch current profile info to pre-populate the form
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFullName(response.data.user.fullName);
        setPhone(response.data.user.phone);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user.token]);

  const handleSave = async () => {
    try {
      const updatedProfile = { fullName, phone };
      await axios.patch('http://localhost:5000/api/users/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigation.goBack();  // Go back after saving changes
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  }
});

export default EditProfileScreen;
