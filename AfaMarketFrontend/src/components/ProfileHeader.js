// ProfileHeader.js For displaying user profile header (name, rating, etc.)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';

const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.header}>
      <Avatar imageUrl={user.profilePhoto} size={80} />
      <Text style={styles.name}>{user.fullName}</Text>
      <Text style={styles.rating}>Rating: {user.averageRating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProfileHeader;
