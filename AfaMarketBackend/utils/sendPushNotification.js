
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebaseServiceAccountKey.json");


// Initialize Firebase Admin SDK


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
