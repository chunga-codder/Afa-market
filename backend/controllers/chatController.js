const Chat = require("../models/Chat");
const { sendNotification } = require("./notificationController");

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        let fileUrl = null;
        let fileType = null;

        if (req.file) {
            fileUrl = req.file.path;
            if (req.file.mimetype.startsWith("audio")) {
                fileType = "audio";
            } else {
                fileType = "document";
            }
        }

        const newMessage = new Chat({
            senderId: req.userId,
            receiverId,
            message,
            fileUrl,
            fileType,
        });

        await newMessage.save();

        await sendNotification(receiverId, "chat", "You have a new message.");

        res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
