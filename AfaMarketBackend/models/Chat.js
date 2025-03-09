const mongoose = require("mongoose");

// Define message schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  fileUrl: { type: String }, // Store file URL if a file is sent
  fileType: { type: String }, // File type: "image", "video", "document"
  read: { type: Boolean, default: false }, // Track whether the message has been read
  timestamp: { type: Date, default: Date.now }, // Timestamp for when the message was sent
});

// Define chat schema
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users involved in the chat
  messages: [messageSchema], // Array of messages in the chat
  lastUpdated: { type: Date, default: Date.now }, // Last updated timestamp
});

// Auto-update the lastUpdated field whenever a message is added
chatSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("Chat", chatSchema);
