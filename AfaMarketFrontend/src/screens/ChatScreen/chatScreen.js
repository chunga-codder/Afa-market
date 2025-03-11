// src/screens/chat/ChatScreen.js
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
  const { recipientId } = route.params; // User you're chatting with
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
    listenForMessages((newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);

  const handleSendMessage = async () => {
    if ((message.trim() || selectedFile) && userId) {
      await sendMessage(recipientId, userId, message, selectedFile);
      setMessages((prevMessages) => [...prevMessages, { senderId: userId, message, file: selectedFile?.uri }]);
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10, alignSelf: item.senderId === userId ? 'flex-end' : 'flex-start' }}>
              {item.file ? (
                <TouchableOpacity onPress={() => {/* Handle file preview */}}>
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                    {item.file.split('/').pop()}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ backgroundColor: item.senderId === userId ? '#007bff' : '#e4e6eb', padding: 10, borderRadius: 8 }}>
                  {item.message}
                </Text>
              )}
            </View>
          )}
        />
        
        {selectedFile && (
          <View style={{ marginBottom: 10 }}>
            <Text>Selected File: {selectedFile.name}</Text>
          </View>
        )}

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
