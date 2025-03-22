const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const sendPushNotification = require('../utils/sendPushNotification');

// Setup Twilio for SMS notifications
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Setup Nodemailer for Email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Real-time notification manager (using Socket.IO)
let io;

exports.setSocketInstance = (socketInstance) => {
  io = socketInstance;
};

// Send Email Notification
const sendEmailNotification = async (toEmail, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

// Send SMS Notification
const sendSMSNotification = async (toPhoneNumber, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      to: toPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    });
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};

// Create in-app push notification, email, and SMS
exports.createNotification = async (userId, message, type, userPhoneNumber, userEmail) => {
  try {
    // Save the notification in the database with status as "unread"
    const newNotification = new Notification({
      userId,
      message,
      type,
      status: 'unread', // Status is set to 'unread' initially
      createdAt: new Date(),
    });

    await newNotification.save();

    // Emit to the user's socket for real-time notification
    io.to(userId.toString()).emit('notification', {
      message,
      type,
      status: 'unread', // Aligning with the schema's 'status' field
      createdAt: new Date(),
    });

    // Send SMS (for high-priority notifications like transfers and disputes)
    if (type === 'transaction' || type === 'dispute') {
      await sendSMSNotification(userPhoneNumber, message);
    }

    // Send Email (for critical updates like escrow releases or dispute resolutions)
    await sendEmailNotification(userEmail, `New Notification: ${type}`, message);

    // Send Push Notification (for all notifications)
    await sendPushNotification(userId, message);

    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Unable to create notification');
  }
};

// Mark notification as read (updates the status to 'read')
exports.markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.status = 'read'; // Update the notification status to 'read'
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Unable to mark notification as read');
  }
};

// Get notifications for a user, including their status
exports.getNotifications = async (userId) => {
  try {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    throw new Error('Unable to retrieve notifications');
  }
};
