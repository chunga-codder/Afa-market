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