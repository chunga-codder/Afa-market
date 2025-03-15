// ServiceItem.js Used for listing services in the app.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';

const ServiceItem = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Avatar imageUrl={service.providerProfilePhoto} size={50} />
      <View style={styles.info}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  info: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default ServiceItem;
