### Backend - Part 1: Project Setup & Server.js
We'll start by setting up the Node.js backend with Express.js and MongoDB. This will include:

# Installing dependencies
Setting up the project structure
Creating server.js as the main entry point


* express – Web framework
* mongoose – MongoDB ODM
* dotenv – Environment variable management
* body-parser – Parses incoming request bodies
* bcryptjs – For password hashing
* jsonwebtoken – JWT authentication
* multer – For file uploads (e.g., ID * * verification images)
* uuid – Generates unique IDs
* nodemailer – Sends emails for verification and notifications
* axios – Makes HTTP requests
* helmet – Security middleware
* morgan – Logs requests

## Project structure
marketplace-backend/
│── models/          # Database Schemas
│── controllers/     # Business Logic
│── routes/          # API Endpoints
│── utils/           # Helper Functions
│── config/          # Database & Config
│── server.js        # Entry Point
│── .env             # Environment Variables
│── package.json     # Dependencies

### Backend - Part 2: User Authentication (Signup, Login, JWT Tokens)
Now that the server and database are set up, we’ll add user authentication using:
✅ Signup & Login (Email + Password)
✅ Password Hashing with bcrypt
✅ JWT Token Generation for Authentication
✅ User Schema & Model in MongoDB


### TESTING AUTHROUTS FOR LIGIN AND SIGNUP
5. Test Authentication API
Start the server:


Test Signup API
POST request to:

http://localhost:5000/api/auth/register
Body (JSON format):

json
Body as:
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "phone": "+237612345678"
}
✅ Response (Success):
.....................................

json

{
    "message": "User registered successfully"
}
Test Login API
POST request to:

bash
Copy
Edit
http://localhost:5000/api/auth/login
Body (JSON format):

json
Copy
Edit
{
    "email": "john@example.com",
    "password": "securepassword"
}
✅ Response (Success):

json
Copy
Edit
{
    "message": "Login successful",
    "token": "your_jwt_token_here",
    "user": {
        "_id": "612345abcdef",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+237612345678",
        "isVerified": false,
        "walletBalance": 0,
        "role": "user"
    }
}


## Now that authentication is working, the next part will include:
✅ KYC Verification (ID Upload, Facial Recognition Placeholder)
✅ Wallet System (Deposit, Withdraw, Transfers)
✅ User Profile & Account Management

### Backend - Part 3: KYC Verification & User Profile Management

Test KYC Upload API
Start the server again:

Edit
node server.js
Test Upload KYC API
POST request to:

Edit
http://localhost:5000/api/kyc/upload
Headers (Authorization: Bearer JWT_TOKEN)

Make sure you include the JWT token from the login response.
Form-data (Upload ID Card)

Select file (idCard) with your ID image.
Response (Success)
json

{
    "message": "KYC Verification Successful",
    "user": {
        "_id": "612345abcdef",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+237612345678",
        "isVerified": false,
        "walletBalance": 0,
        "role": "user",
        "kycVerified": true,
        "idCardImage": "uploads/kyc/1633645200000-id_image.png"
    }
}


## Now that KYC verification is implemented, the next part will focus on:
✅ User Profile Management (Change Password, Update Profile)
✅ Wallet System (Deposit, Withdraw, Transfers)

### Backend - Part 4: User Profile Management (Change Password & Update Profile)
Now that we've implemented KYC verification, we’ll move to User Profile Management. This will allow users to:

Change their password
Update their profile details (e.g., full name, phone number)

### . Test User Profile Update API

node server.js
Test Update Profile API
PUT request to:

bash
Copy
Edit
http://localhost:5000/api/users/profile
Headers (Authorization: Bearer JWT_TOKEN)

Make sure to use the JWT token you got from the login response.
Body (JSON format):

json
{
    "fullName": "Johnathan Doe",
    "phone": "+237612345679"
}
Response (Success)
json

{
    "message": "Profile updated successfully",
    "user": {
        "_id": "612345abcdef",
        "fullName": "Johnathan Doe",
        "email": "john@example.com",
        "phone": "+237612345679",
        "isVerified": false,
        "walletBalance": 0,
        "role": "user",
        "kycVerified": true,
        "idCardImage": "uploads/kyc/1633645200000-id_image.png"
    }
}
Test Change Password API
PUT request to:

bash
http://localhost:5000/api/users/password
Headers (Authorization: Bearer JWT_TOKEN)

Use the JWT token from the login.
Body (JSON format):

json
Copy
Edit
{
    "currentPassword": "securepassword",
    "newPassword": "newsecurepassword"
}
Response (Success)
json

{
    "message": "Password changed successfully"
}

### Summary of User Profile Endpoints
Update Profile: PUT /api/users/profile (Updates name, phone, etc.)
Change Password: PUT /api/users/password (Updates password)

### Next Steps
Now that User Profile Management is in place, the next part will focus on:
✅ Wallet System (Deposit, Withdraw, Transfers)
✅ Transaction History
✅ Escrow Integration

### Backend - Part 5: Wallet System (Deposit, Withdraw, Transfers)
Now that we have User Profile Management and KYC Verification set up, we’ll focus on the Wallet System. This will allow users to:

Deposit funds into their wallet
Withdraw funds
Transfer funds to other users

### . Testing the Wallet API
Make sure your server is running:

node server.js
Test Deposit API
POST request to:

http://localhost:5000/api/wallet/deposit
Headers (Authorization: Bearer JWT_TOKEN)

Use the JWT token from the login response.
Body (JSON format):

{
    "amount": 1000,
    "paymentMethod": "MTN"
}
Response (Success)

{
    "message": "Deposit successful",
    "walletBalance": 1000,
    "paymentInfo": { /* Flutterwave response data */ }
}
Test Withdraw API
POST request to:


http://localhost:5000/api/wallet/withdraw
Headers (Authorization: Bearer JWT_TOKEN)

Use the JWT token from login.
Body (JSON format):


{
    "amount": 500,
    "paymentMethod": "MTN"
}
Response (Success)
{
    "message": "Withdrawal successful",
    "walletBalance": 500,
    "paymentInfo": { /* Flutterwave response data */ }
}
Test Transfer API
POST request to:

http://localhost:5000/api/wallet/transfer
Headers (Authorization: Bearer JWT_TOKEN)

Use the JWT token from login.
Body (JSON format):

{
    "recipientId": "612345abcdef", // Use the recipient user ID
    "amount": 200
}
Response (Success)
json
Copy
Edit
{
    "message": "Transfer successful",
    "senderWalletBalance": 300,
    "recipientWalletBalance": 1200
}
5. ### Summary of Wallet Endpoints
Deposit Funds: POST /api/wallet/deposit (Deposit funds into wallet)
Withdraw Funds: POST /api/wallet/withdraw (Withdraw funds from wallet)
Transfer Funds: POST /api/wallet/transfer (Transfer funds to another user)

# Next Steps
Now that the Wallet System is set up, the next step will focus on:
✅ Transaction History (View past transactions)
✅ Escrow Integration (Automated fund release when a job is done)

Let me know when you're ready for the next step!

# Backend - Part 6: Transaction History and Escrow Integration
Now that we have implemented the Wallet System, we will proceed with:

Transaction History – To view past transactions made by the user.
Escrow System – To hold funds until a job is completed and release the funds when conditions are met.

## . Testing the Transaction & Escrow APIs
Start the server:

sh
Copy
Edit
node server.js
Test Escrow Creation API
POST request to:

bash
Copy
Edit
http://localhost:5000/api/transactions/escrow
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

json
Copy
Edit
{
    "jobId": "613bb4fa9f1f5b4f1c39c8e8",
    "amount": 1000,
    "recipientId": "613bb4fa9f1f5b4f1c39c8e9"
}
Response (Success)
json
Copy
Edit
{
    "message": "Escrow created successfully",
    "senderWalletBalance": 9000,
    "escrow": {
        "_id": "613bb4fa9f1f5b4f1c39c8f0",
        "amount": 1000,
        "senderId": "613bb4fa9f1f5b4f1c39c8e8",
        "recipientId": "613bb4fa9f1f5b4f1c39c8e9",
        "status": "pending",
        "createdAt": "2025-03-07T00:00:00.000Z"
    },
    "transaction": {
        "_id": "613bb4fa9f1f5b4f1c39c8f1",
        "userId": "613bb4fa9f1f5b4f1c39c8e8",
        "transactionType": "escrow",
        "amount": 1000,
        "balanceAfterTransaction": 9000,
        "status": "pending"
    }
}
Test Complete Escrow API
POST request to:

bash
Copy
Edit
http://localhost:5000/api/transactions/escrow/complete
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

json
Copy
Edit
{
    "escrowId": "613bb4fa9f1f5b4f1c39c8f0"
}
Response (Success)
json
Copy
Edit
{
    "message": "Escrow completed, funds released",
    "senderWalletBalance": 9000,
    "recipientWalletBalance": 2000,
    "transaction": {
        "_id": "613bb4fa9f1f5b4f1c39c8f2",
        "userId": "613bb4fa9f1f5b4f1c39c8e8",
        "transactionType": "escrow",
        "amount": 1000,
        "balanceAfterTransaction": 9000,
        "status": "completed"
    }
}
Next Steps
Now that the Transaction History and Escrow System are set up, the next step will focus on:
✅ Final Testing for end-to-end wallet functionality
✅ Escrow Release Automation
✅ Publish App (Frontend & Backend Integration)



# Backend - Part 7: Admin and Agent Dashboards, Fund Release, Dispute Resolution
In this section, we will be implementing the Admin Dashboard, Agent Dashboard, and the feature for handling Dispute Resolution and Admin-controlled Fund Release. These features will allow the admin to manage transactions, view transaction histories, and control the release of funds after disputes are resolved.

## 6. Testing Admin and Dispute Resolution
Start the server:

sh
Copy
Edit
node server.js
Test Raising a Dispute
POST request to:

bash
Copy
Edit
http://localhost:5000/api/disputes/raise
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

json
Copy
Edit
{
    "escrowId": "613bb4fa9f1f5b4f1c39c8f0",
    "reason": "The work was not completed"
}
Test Resolving a Dispute
POST request to:

bash
Copy
Edit
http://localhost:5000/api/disputes/resolve
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

{
    "disputeId": "613bb4fa9f1f5b4f1c39c8f2",
    "decision": "refund"
}
Test Closing a Dispute
POST request to:

http://localhost:5000/api/disputes/close
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

{
    "disputeId": "613bb4fa9f1f5b4f1c39c8f2"
}


## Now that we've covered the Admin Dashboard, Agent Dashboard, and Dispute Resolution system, the next steps will focus on:

Transaction History View for Admins and Users.
Super Admin Controls for Fund Releases and Transaction Approval.
Frontend Integration with the Admin, Agent, and User Dashboards.

# Backend - Part 8: Transaction History, Admin & Super Admin Control
In this section, we will focus on providing Transaction History functionality for both the admin and users, and include Super Admin Controls for fund releases and transaction approval. This section will also cover integrating the front-end with these features.

## 9. Testing the Transactions
Start the server:

sh
Copy
Edit
node server.js
Test Creating a Transaction
POST request to:

bash
Copy
Edit
http://localhost:5000/api/transactions/create
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

json
Copy
Edit
{
    "senderId": "613bb4fa9f1f5b4f1c39c8f0",
    "recipientId": "613bb4fa9f1f5b4f1c39c8f1",
    "amount": 100,
    "transactionType": "payment"
}
Test User Transaction History
GET request to:

bash
Copy
Edit
http://localhost:5000/api/transactions/user/history
Headers (Authorization: Bearer JWT_TOKEN)

Test Admin Transaction History
GET request to:

bash
Copy
Edit
http://localhost:5000/api/transactions/admin/history
Headers (Authorization: Bearer JWT_TOKEN)

Test Super Admin Approving a Transaction
POST request to:

bash
Copy
Edit
http://localhost:5000/api/superadmin/approve
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

json
Copy
Edit
{
    "transactionId": "613bb4fa9f1f5b4f1c39c8f2"
}
Test Super Admin Rejecting a Transaction
POST request to:

bash
Copy
Edit
http://localhost:5000/api/superadmin/reject
Headers (Authorization: Bearer JWT_TOKEN)

Body (JSON format):

json
Copy
Edit
{
    "transactionId": "613bb4fa9f1f5b4f1c39c8f2"
}


# Final Steps
notification system is an important part of my marketplace app. It ensures that users, admins, and service providers stay updated on key events such as:

Transaction updates (payment received, escrow released, refund processed)
KYC verification status (approved/rejected)
Chat messages (real-time messaging)
Service requests & job completion
Dispute resolutions
The notification system includes:

In-app notifications (via MongoDB & WebSockets)
Push notifications (via Firebase Cloud Messaging - FCM)
SMS notifications (for important events like payment processing)

✅ MongoDB-based in-app notifications
✅ Real-time notifications via WebSockets
✅ Push notifications via Firebase
✅ SMS notifications for critical events

Would you like me to add admin dashboard notifications next? 🚀

# Final Features Added 🚀
✅ Users can send text, images, and files
✅ Images & files are stored in Cloudinary
✅ Messages update in real-time using Socket.IO
✅ Users can open files & view images in chat
✅ Users can record & send voice notes
✅ Voice notes are stored in Cloudinary
✅ Users can play received voice notes
✅ Real-time messaging with Socket.IO