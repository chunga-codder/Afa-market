// InputField.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry, style }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default InputField;


//For consistent input fields with custom styles.