const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.YOUR_TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

exports.sendSMS = async (to, message) => {
    try {
        await client.messages.create({
            body: message,
            from: twilioPhone,
            to,
        });
        console.log("SMS sent successfully");
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
};
