import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TextInput, Button, 
  KeyboardAvoidingView, Platform, TouchableOpacity, Image 
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  connectToChat, sendMessage, listenForMessages, 
  fetchChatHistory, markMessagesAsRead, disconnectChat 
} from '../../services/chatService';

const ChatScreen = ({ route }) => {
  const { recipientId, recipientAvatar, recipientName, bookingId } = route.params; // Added bookingId
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingTaken, setBookingTaken] = useState(false);

  useEffect(() => {
    loadUserData();

    return () => {
      disconnectChat();
    };
  }, []);

  const loadUserData = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    setUserId(storedUserId);
    connectToChat(storedUserId);
    loadChatHistory(storedUserId, recipientId);
  };

  const loadChatHistory = async (userId, recipientId) => {
    const history = await fetchChatHistory(userId, recipientId);
    setMessages(history);
    markMessagesAsRead(userId, recipientId);
  };

  useEffect(() => {
    if (userId && recipientId) {
      listenForMessages((newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [userId, recipientId]);

  const handleSendMessage = async () => {
    if ((message.trim() || selectedFile) && userId) {
      await sendMessage(conversationId, userId, message, selectedFile);
      setMessages((prevMessages) => [
        ...prevMessages, 
        { senderId: userId, message, file: selectedFile?.uri }
      ]);
      setMessage('');
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });
      setSelectedFile(result);
    } catch (err) {
      console.error('File selection canceled', err);
    }
  };

  const confirmBooking = async () => {
    // Simulated API request to confirm booking
    try {
      const response = await fetch(`https://yourapi.com/confirm-booking/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const result = await response.json();
      if (result.success) {
        setBookingConfirmed(true);
      } else if (result.alreadyTaken) {
        setBookingTaken(true);
      }
    } catch (error) {
      console.error('Booking confirmation failed', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        
        {/* Profile Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={{ uri: recipientAvatar }}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{recipientName}</Text>
            <Text style={{ color: 'gray' }}>Online</Text>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' }}>
              {item.senderId !== userId && (
                <Image
                  source={{ uri: recipientAvatar }}
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                />
              )}
              <View style={{ flexDirection: 'column', alignItems: item.senderId === userId ? 'flex-end' : 'flex-start' }}>
                {item.senderId !== userId && (
                  <Text style={{ fontWeight: 'bold' }}>{recipientName}</Text>
                )}
                {item.file ? (
                  <TouchableOpacity onPress={() => {/* Handle file preview */}}>
                    <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                      {item.file.split('/').pop()}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={{ 
                    backgroundColor: item.senderId === userId ? '#007bff' : '#e4e6eb', 
                    padding: 10, 
                    borderRadius: 8, 
                    maxWidth: '75%' }}>
                    {item.message}
                  </Text>
                )}
              </View>
            </View>
          )}
        />

        {/* File Upload */}
        {selectedFile && (
          <View style={{ marginBottom: 10 }}>
            <Text>Selected File: {selectedFile.name}</Text>
          </View>
        )}

        {/* Confirm Booking Button */}
        {!bookingConfirmed && !bookingTaken && (
          <Button title="Confirm Booking" onPress={confirmBooking} color="green" />
        )}
        {bookingConfirmed && <Text style={{ color: 'green', textAlign: 'center', marginVertical: 10 }}>Booking Confirmed ✅</Text>}
        {bookingTaken && <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>Already Taken ❌</Text>}

        {/* Message Input and Send Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            placeholder="Type your message"
            value={message}
            onChangeText={setMessage}
            style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 10, paddingLeft: 8 }}
          />
          <TouchableOpacity onPress={handleFileUpload}>
            <Text style={{ color: 'blue' }}>📎</Text>
          </TouchableOpacity>
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
