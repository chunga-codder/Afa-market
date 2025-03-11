import io from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const socket = io(API_URL, { transports: ['websocket'] });

// Connect to chat
export const connectToChat = (userId) => {
  socket.emit('join', { userId });
};

// Send a message (with optional file upload)
export const sendMessage = async (conversationId, senderId, message, file = null) => {
  try {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    formData.append('senderId', senderId);
    formData.append('message', message);

    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    const response = await axios.post(`${API_URL}/chat`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Emit the message via socket
    socket.emit('send_message', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Listen for new messages
export const listenForMessages = (callback) => {
  socket.on('receive_message', (message) => {
    callback(message);
  });
};

// Fetch chat history between two users
export const fetchChatHistory = async (userId, recipientId) => {
  try {
    const response = await axios.get(`${API_URL}/chat-history/${userId}/${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId, userId) => {
  try {
    await axios.put(`${API_URL}/chat/mark-as-read`, { conversationId, userId });
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

// Disconnect from chat
export const disconnectChat = () => {
  socket.disconnect();
};
