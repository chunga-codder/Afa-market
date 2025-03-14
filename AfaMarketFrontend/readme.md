# File Structure 
/src
├── /assets                    # Static assets like images, icons, fonts
├── /components                # Reusable components
│   ├── /auth                  # Authentication related components
│   ├── /chat                  # Chat components
│   ├── /dispute               # Dispute components
│   ├── /earnings              # Earnings components
│   ├── /escrow                # Escrow components
│   ├── /kyc                   # KYC components
│   ├── /notifications         # Notifications components
│   ├── /payments              # Payment components
│   ├── /services              # Services components
│   ├── /superadmin            # SuperAdmin components
│   ├── /transaction           # Transaction components
│   ├── /user                  # User profile components
│   ├── /wallet                # Wallet components
├── /navigation                # App and authentication navigation
│   ├── /AuthNavigator.js      # Navigation for login and signup
│   ├── /MainNavigator.js      # Main app navigation (after login)
│   ├── /SuperAdminNavigator.js# SuperAdmin navigation
│   ├── /TabNavigator.js       # For home, earnings, wallet, etc.
├── /screens                   # App screens (different pages)
│   ├── /auth                  # Auth-related screens (Login, Register)
│   ├── /chat                  # Chat screens
│   ├── /dispute               # Dispute screens
│   ├── /earnings              # Earnings screens
│   ├── /escrow                # Escrow-related screens
│   ├── /kyc                   # KYC verification screens
│   ├── /notifications         # Notifications screens
│   ├── /payments              # Payment-related screens
│   ├── /services              # Services-related screens
│   ├── /superadmin            # SuperAdmin dashboard screens
│   ├── /transaction           # Transaction screens
│   ├── /user                  # User profile and settings screens
│   ├── /wallet                # Wallet-related screens
├── /services                  # API services (to interact with the backend)
│   ├── /authService.js        # Login, Register, Logout
│   ├── /chatService.js        # Handle chat messages
│   ├── /disputeService.js     # Dispute-related API
│   ├── /earningsService.js    # Earnings-related API
│   ├── /escrowService.js      # Escrow-related API
│   ├── /kycService.js         # KYC-related API
│   ├── /notificationService.js# Notifications-related API
│   ├── /paymentService.js     # Payments-related API
│   ├── /serviceService.js     # Services-related API
│   ├── /superAdminService.js  # SuperAdmin-related API
│   ├── /transactionService.js # Transaction history-related API
│   ├── /userService.js        # User-related API
│   ├── /walletService.js      # Wallet-related API
├── /utils                     # Utility functions (e.g., date formatting, etc.)
│   ├── /helpers.js            # Helper functions (e.g., for date comparison)
│   ├── /validation.js         # Form validation functions
├── /App.js                    # Main entry point of the app
└── /config                    # Configuration files (e.g., API base URL, environment variables)
    ├── /apiConfig.js          # API configurations (base URL, etc.)
    ├── /authConfig.js         # Auth configurations (JWT, etc.)





First, I'll need to set up a React Native project. If you haven’t done so already, follow the instructions below.

Install React Native CLI (if you haven't already):


npm install -g react-native-cli
Create a new React Native project:


npx react-native init MarketplaceApp
cd MarketplaceApp
Install required dependencies:

React Navigation (for navigation between screens):


npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
React Navigation Tab Navigator (for bottom tabs navigation):

npm install @react-navigation/bottom-tabs
React Native Gesture Handler (dependency for navigation):

npm install react-native-gesture-handler
React Native Reanimated (dependency for animations):


npm install react-native-reanimated
Axios (for API requests):


npm install axios
Link necessary dependencies: For iOS, run:


cd ios && pod install
Run the app:

For Android:

npx react-native run-android
For iOS:

npx react-native run-ios

# Login Screen and Register Screen don with KYC on Register Screen

## KYC ON REGISTER SCREEN HA 
Key Features:
Email and Password Fields:

Simple email and password fields for registration.
ID Card Upload (for KYC):

Uses the launchImageLibrary (from react-native-image-picker or expo-image-picker if you’re using Expo) to pick an image from the gallery for ID verification.
Displays the selected ID card image once uploaded.
Facial Recognition (for KYC):

Uses the launchCamera to take a photo for facial recognition during registration.
Displays the photo once captured.
Form Validation:

Ensures all fields (email, password, ID card, and face photo) are filled before submitting the form.
Registration Call:

Sends the form data (email, password, ID card, and face photo) to the backend for registration via the registerUser service.

# TO DO BY DIFF DEV
 Install Dependencies (for iOS)
If you're working on iOS, navigate to the ios folder and run:


cd ios && pod install && cd ..
3. Add Required Permissions
For Android:
Open android/app/src/main/AndroidManifest.xml and add:

xml

<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
For iOS:
In ios/YourApp/Info.plist, add:

xml

<key>NSCameraUsageDescription</key>
<string>App requires access to your camera</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>App requires access to your photo library</string>
4. Rebuild the App
After installing, restart the bundler and rebuild the app:

For Android:


npx react-native run-android
For iOS:


npx react-native run-ios

# FRONT END VIEWS AND FUNCTIONALLITY

Since your app is a **multi-service marketplace** with an **escrow system**, I'll suggest a clean, modern UI with a **user-friendly design**, focusing on **simplicity, efficiency, and a seamless experience** for both clients and agents.  

---

## **🔹 UI Suggestions for Your Marketplace App (React Native)**  

### **1️⃣ Welcome & Authentication**  
✅ **Splash Screen** – A simple logo animation with your app name.  
✅ **Login/Register Screens** – Clean UI with email/phone login, social login, and OTP verification.  
✅ **KYC Verification Screen** – A step-by-step process to verify agents and users (ID upload, selfie, address proof).  

---

### **2️⃣ Home Screen (Client & Agent)**  
👤 **Client View:**  
- Search bar (to find agents by category, location)  
- Featured services (cards with images & descriptions)  
- Categories section (Cleaning, Water Supply, Home Transfer, Food Delivery)  
- “Top-rated” & “Available Now” service providers  

👨‍🔧 **Agent View:**  
- Toggle for **Availability Status**  
- Quick links: **View Bookings, Earnings, Analytics, Profile**  
- Recent requests and upcoming jobs  

🛠 **Navigation:**  
- **Bottom Tab Navigation:** Home | Bookings | Wallet | Profile  
- **Drawer Menu (for extra features like support, settings, help center)**  

---

### **3️⃣ Service Booking & Escrow Management**  
📌 **Service Details Page**  
- Service description, images, price estimate  
- **Agent’s Profile** (ratings, reviews, experience, availability toggle)  
- “Book Now” button → Opens a payment confirmation screen  

💰 **Escrow Payment Screen**  
- **Select Payment Method** (Mobile Money, Wallet, Card)  
- **Escrow Confirmation & Fee Breakdown**  
- Payment success page with status updates  

🛑 **Dispute Resolution UI**  
- “Raise a Dispute” button inside active orders  
- Live chat between client & agent  
- Admin intervention option  

---

### **4️⃣ Wallet & Payment Management**  
💼 **Wallet Screen (For Clients & Agents)**  
- Balance overview  
- “Deposit” & “Withdraw” buttons  
- Transaction history (Pending, Completed, Disputed)  
- Withdraw to **Mobile Money** or **Bank Account**  

📊 **Earnings & Analytics (For Agents)**  
- **Daily, Weekly, Monthly Earnings**  
- **Ratings & Reviews Summary**  
- **Total Jobs Completed & Customer Satisfaction %**  

---

### **5️⃣ Notifications & Communication**  
🔔 **Push & SMS Notifications**  
- Payment received  
- Escrow release updates  
- Dispute resolution updates  

💬 **Live Chat System**  
- **Client & Agent chat** (after booking)  
- **Chat with Admin (for disputes & support)**  

---

### **6️⃣ Profile & Settings**  
👤 **User Profile Page**  
- Profile picture, name, phone, email  
- Service history (for clients)  
- Work experience & certifications (for agents)  

⚙️ **Settings**  
- **Notification Preferences**  
- **Language & Theme (Dark Mode)**  
- **Support & FAQs**  

---

## 🎨 **Design Style Guide**  
✅ **Color Scheme:** Professional & clean (e.g., Blue & White with accents)  
✅ **Typography:** Readable fonts (e.g., Inter, Poppins, or Montserrat)  
✅ **Buttons & Cards:** Rounded corners, shadows for depth  
✅ **Icons:** Simple, intuitive icons (Lucide or Material Icons)  

## APP FLOW FROM BOOKING

After a user clicks **"Book Now"**, the app should guide them through the **escrow payment and order confirmation process**. Here's how it should flow:  

---

### **🔹 Post-"Book Now" Flow (Step-by-Step)**  

### **1️⃣ Payment & Escrow Confirmation Screen**  
✅ The user is taken to a **Payment & Escrow Confirmation** screen, showing:  
   - **Service Details** (name, price, agent info)  
   - **Total Amount Breakdown** (service fee + escrow fee, if applicable)  
   - **Payment Methods:**  
     - Mobile Money (Flutterwave)  
     - Wallet Balance   
   - **"Confirm & Pay" Button**  

🔹 **If Wallet is insufficient**, show a **"Top Up Wallet"** option.  

---

### **2️⃣ Payment Processing & Escrow Holding**  
✅ After the user confirms payment:  
   - Funds are **held in escrow** (not sent to the agent yet).  
   - A **booking confirmation screen** appears with:  
     - Booking ID  
     - Estimated time for service delivery  
     - A **"Chat with Agent"** button (opens a chat for communication).  
   - The agent receives a **new booking notification**.  

---

### **3️⃣ Agent Accepts or Declines the Booking**  
🔹 **If the agent accepts:**  
   - The booking moves to **"Ongoing"** status.  
   - The user sees **real-time updates** on the agent’s progress.  

🔹 **If the agent declines or doesn’t respond within a time limit:**  
   - The booking is **canceled**, and the funds **return to the user's wallet**.  
   - The user can **book another agent**.  

---

### **4️⃣ Service Completion & Escrow Release**  
✅ Once the service is completed:  
   - The **user confirms service delivery** (via a “Mark as Completed” button).  
   - The escrow **releases the payment to the agent**.  
   - The user is prompted to **rate and review the agent**.  

🔹 **If the user doesn’t confirm within 48 hours, escrow auto-releases funds** unless a dispute is raised.  

---

### **5️⃣ Dispute Handling (If Needed)**  
🚨 If the user has issues with the service:  
   - They can **"Raise a Dispute"** from the order screen.  
   - A **live chat with the agent** opens for resolution.  
   - If unresolved, the case goes to **admin intervention**.  
   - Admin manually **decides the dispute** and either releases funds to the agent or refunds the user.  

---
