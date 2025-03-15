// ServiceCategory.js This can be used in a screen where services are categorized.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ServiceCategory = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.category} onPress={onPress}>
      <Text style={styles.categoryText}>{category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  category: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    marginVertical: 5,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceCategory;
