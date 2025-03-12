require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const crypto = require('crypto');

const Escrow = require('./models/Escrow');
const authRoutes = require('./routes/authRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require('./routes/paymentRoutes'); // Import your payment routes
const earningsRoutes = require('./routes/earningsRoutes'); // Import Earnings Routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import Analytics Routes
const disputeRoutes = require('./routes/disputeRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const walletRoutes = require('./routes/walletRoutes');
const nearbyUserRoutes = require('./routes/nearbyUsers'); // Import your new nearby user route
const kycRoutes = require('./routes/kycRoutes');
const fs = require('fs')

// Step 1: Generate a secure random JWT secret key
const secretKey = crypto.randomBytes(64).toString('hex');  // This is the JWT secret key you will encrypt

fs.appendFileSync('.env', `\nJWT_SECRET=${secretKey}\n`, { flag: 'a' });



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
app.use("/api/users", userRoutes);
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes); // Integrate payment-related routes (including webhook)
app.use('/api/services', serviceRoutes);
app.use('/api/earnings', earningsRoutes); // Earnings API
app.use('/api/analytics', analyticsRoutes); // Analytics API
app.use('/api/nearby-users', nearbyUserRoutes); // Register the new route for nearby users

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
