require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const Escrow = require('./models/Escrow');
const authRoutes = require('./routes/authRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require('./routes/paymentRoutes'); // Import the payment routes
const paymentRoutes = require('./routes/paymentRoutes'); // Import your payment routes
const earningsRoutes = require('./routes/earningsRoutes'); // Import Earnings Routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import Analytics Routes


// Now you can use rateTransaction in your routes

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Function to send real-time notifications
exports.sendRealTimeNotification = (userId, message) => {
    io.to(userId).emit("newNotification", message);
};


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Load Routes
app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/kyc", require("./routes/kycRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/disputes", require("./routes/disputeRoutes"));
app.use("/api/superadmin", require("./routes/superAdminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use('/api/escrow', escrowRoutes);
app.use('/api/auth', authRoutes); // Routes for authentication (sign up, login)
app.use('/api/chat', chatRoutes);
app.use("/api/users", userRoutes); // Use the user routes
app.use('/api', paymentRoutes); // Integrate payment-related routes (including webhook)
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/earnings', earningsRoutes); // Earnings API
app.use('/api/analytics', analyticsRoutes); // Analytics API

// Use the transaction routes
// Root Route
app.get("/", (req, res) => {
    res.send("Marketplace API is running...");
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ======= SOCKET.IO (Real-Time Chat) ======= //
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins the chat
  socket.on('join', (userId) => {
    if (userId) {
      socket.userId = userId;
      activeUsers.set(userId, socket.id);
      io.emit('userStatus', Array.from(activeUsers.keys()));
    }
  });

  // Handle direct messaging
  socket.on('sendMessage', ({ senderId, recipientId, content }) => {
    const recipientSocketId = activeUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('chatMessage', { senderId, content });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    activeUsers.delete(socket.userId);
    io.emit('userStatus', Array.from(activeUsers.keys())); // Update online users
  });
});
