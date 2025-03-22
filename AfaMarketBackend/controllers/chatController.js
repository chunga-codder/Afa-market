const Chat = require("../models/Chat");
const User = require("../models/User");
const Booking = require("../models/Booking"); // ✅ Added missing import
const { sendNotification } = require("./notificationController");
const asyncHandler = require("express-async-handler");

// ✅ Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message, bookingId } = req.body;

  if (!receiverId || !message.trim()) {
    return res.status(400).json({ error: "Receiver ID and message are required." });
  }

  if (receiverId === req.userId) {
    return res.status(400).json({ error: "You cannot send a message to yourself." });
  }

  let chat = await Chat.findOne({ participants: { $all: [req.userId, receiverId] } });

  if (!chat) {
    chat = new Chat({ participants: [req.userId, receiverId], messages: [] });
  }

  const sender = await User.findById(req.userId).select("name profilePhoto");

  const newMessage = {
    sender: req.userId,
    senderName: sender.name,
    senderPhoto: sender.profilePhoto || null,
    message,
    read: false,
    timestamp: Date.now(),
    bookingId: bookingId || null, // 🔥 Attach booking if available
  };

  chat.messages.push(newMessage);
  await chat.save();

  // Emit message event via Socket.IO
  req.io.to(receiverId).emit("newMessage", newMessage);

  // Send notification
  await sendNotification(receiverId, "chat", `${sender.name} sent you a message.`);

  res.status(201).json({ message: "Message sent successfully", newMessage });
});


// ✅ Get chat history
exports.getChatHistory = asyncHandler(async (req, res) => {
  const { userId, recipientId } = req.params;

  if (!userId || !recipientId) {
    return res.status(400).json({ error: "User ID and Recipient ID are required." });
  }

  const chat = await Chat.findOne({ participants: { $all: [userId, recipientId] } })
    .select("messages")
    .populate("messages.sender", "name profilePhoto")
    .lean();

  // 🔥 Fetch latest booking status if any booking exists in chat
  if (chat?.messages.some((msg) => msg.bookingId)) {
    const bookingIds = [...new Set(chat.messages.map((msg) => msg.bookingId).filter(Boolean))];
    const bookings = await Booking.find({ _id: { $in: bookingIds } });

    chat.messages.forEach((msg) => {
      if (msg.bookingId) {
        const booking = bookings.find((b) => b._id.toString() === msg.bookingId.toString());
        if (booking) msg.bookingStatus = booking.status;
      }
    });
  }

  res.status(200).json(chat?.messages || []);
});


// ✅ Mark messages as read
exports.markAsRead = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  let unreadCount = 0;
  chat.messages.forEach((msg) => {
    if (msg.sender.toString() !== userId && !msg.read) {
      msg.read = true;
      unreadCount++;
    }
  });

  await chat.save();

  res.status(200).json({ message: `Marked ${unreadCount} messages as read.` });
});
