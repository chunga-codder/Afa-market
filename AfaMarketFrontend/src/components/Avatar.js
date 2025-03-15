// Avatar.js Display user profile pictures consistently across screens.
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

const Avatar = ({ imageUrl, size = 50 }) => {
  return (
    <View style={[styles.avatar, { width: size, height: size }]}>
      <Image source={{ uri: imageUrl }} style={[styles.image, { width: size, height: size }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 100,
  },
});

export default Avatar;
