const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../config/firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.sendPushNotification = async (token, title, body) => {
    const message = {
        token,
        notification: {
            title,
            body,
        },
    };

    try {
        await admin.messaging().send(message);
        console.log("Push notification sent successfully");
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};
