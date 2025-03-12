const Chat = require('../models/Chat');
const User = require('../models/User');
const { sendNotification } = require('./notificationController');

// ✅ Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    let fileUrl = null;
    let fileType = null;

    // Handle file uploads (audio/document)
    if (req.file) {
      fileUrl = req.file.path;
      fileType = req.file.mimetype.startsWith("audio") ? "audio" : "document";
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [req.userId, receiverId], messages: [] });
    }

    // Fetch sender details
    const sender = await User.findById(req.userId).select('name profilePhoto');

    // Create message object
    const newMessage = {
      sender: req.userId,
      senderName: sender.name,
      senderPhoto: sender.profilePhoto || null, // Include profile photo
      message,
      fileUrl,
      fileType,
      read: false,
      timestamp: new Date(),
    };

    // Save message in chat
    chat.messages.push(newMessage);
    await chat.save();

    // Emit real-time message event (if using Socket.IO)
    req.io.to(receiverId).emit('newMessage', newMessage);

    // Send notification
    await sendNotification(receiverId, "chat", `${sender.name} sent you a message.`);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;

    const chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    })
      .populate('messages.sender', 'name profilePhoto') // Get sender details
      .lean();

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    // Mark only unread messages from the other user
    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== userId && !msg.read) {
        msg.read = true;
      }
    });

    await chat.save();
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
