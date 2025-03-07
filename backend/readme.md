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