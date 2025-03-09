require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const Escrow = require('./models/Escrow');
const Flutterwave = require('flutterwave-node-v3');
const authRoutes = require('./routes/authRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require("./routes/userRoutes");

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

// Root Route
app.get("/", (req, res) => {
    res.send("Marketplace API is running...");
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
