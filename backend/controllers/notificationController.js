const Notification = require("../models/Notification");

// Create and send a notification
exports.sendNotification = async (userId, type, message) => {
    try {
        const notification = new Notification({ userId, type, message });
        await notification.save();
        console.log("Notification sent:", message);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
