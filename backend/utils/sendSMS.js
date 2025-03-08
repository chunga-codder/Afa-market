const twilio = require("twilio");

const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
const authToken = "YOUR_TWILIO_AUTH_TOKEN";
const twilioPhone = "YOUR_TWILIO_PHONE_NUMBER";

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
