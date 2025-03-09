const Chat = require('../models/Chat');
const { sendNotification } = require('./notificationController');
const User = require('../models/User');

// ✅ Chat Controller (Handles Sending & Receiving Messages)

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    let fileUrl = null;
    let fileType = null;

    // Check if a file is uploaded (audio or document)
    if (req.file) {
      fileUrl = req.file.path;
      if (req.file.mimetype.startsWith("audio")) {
        fileType = "audio";
      } else {
        fileType = "document";
      }
    }

    // Create or find the existing chat between sender and receiver
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [req.userId, receiverId], messages: [] });
    }

    // Create new message object
    const newMessage = {
      sender: req.userId,
      message,
      fileUrl,
      fileType,
      read: false, // Default unread message
    };

    // Add the new message to the chat
    chat.messages.push(newMessage);
    await chat.save();

    // Emit real-time message event (if using Socket.IO)
    req.io.to(receiverId).emit('newMessage', {
      senderId: req.userId,
      message,
      fileUrl,
      fileType,
    });

    // Send notification to the receiver
    await sendNotification(receiverId, "chat", "You have a new message.");

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;

    const chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    }).populate('participants', 'fullName email phone'); // Populate participants instead of messages

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    // Only update unread messages from the other user
    await Chat.updateOne(
      { _id: chatId, 'messages.sender': { $ne: userId }, 'messages.read': false },
      { $set: { 'messages.$[elem].read': true } },
      { arrayFilters: [{ 'elem.sender': { $ne: userId } }] }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
