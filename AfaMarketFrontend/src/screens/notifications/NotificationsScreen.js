import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getNotifications, markNotificationAsRead } from '../services/notificationService'; // Notification services
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications(userId);
        setNotifications(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Handle notification click (mark as read and navigate to details)
  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      const updatedNotifications = notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications); // Update the notification list state
      navigation.navigate('NotificationDetail', { notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Render each notification item
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationClick(item.id)}
    >
      <Text style={styles.notificationTitle}>{item.message}</Text>
      <Text style={styles.notificationDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      {!item.read && <Text style={styles.unreadIndicator}>New</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          ListEmptyComponent={<Text>No notifications available</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  unreadIndicator: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});

export default NotificationsScreen;
