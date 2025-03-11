import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dispute Management
import DisputeListScreen from "../screens/disputes/DisputeListScreen";
import DisputeDetailsScreen from "../screens/disputes/DisputeDetailsScreen";

// Chat
import ChatScreen from "../screens/chat/ChatScreen";

// Earnings & Wallet
import EarningsScreen from "../screens/earnings/EarningsScreen";
import WalletScreen from "../screens/wallet/WalletScreen";
import TransactionHistoryScreen from "../screens/transactions/TransactionHistoryScreen";

// Notifications
import NotificationScreen from "../screens/notifications/NotificationScreen";

// Search & Services
import SearchNearbyScreen from "../screens/search/SearchNearbyScreen";
import ServiceListScreen from "../screens/services/ServiceListScreen";
import ServiceDetailsScreen from "../screens/services/ServiceDetailsScreen";

// Profile
import ProfileScreen, { UpdateProfileScreen, ChangePasswordScreen, KYCUpdateScreen } from "../screens/profile/ProfileScreen";

// Admin Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminTransactionScreen from "../screens/admin/AdminTransactionScreen";
import AdminDisputeScreen from "../screens/admin/AdminDisputeScreen";
import AdminUserManagementScreen from "../screens/admin/AdminUserManagementScreen";
import AdminActivityLogsScreen from "../screens/admin/AdminActivityLogsScreen";
import AdminChatScreen from "../screens/admin/AdminChatScreen";
import AdminUsersListScreen from '../screens/admin/AdminUsersListScreen';
const Stack = createStackNavigator();

const StackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    // Check if user has admin role
    const userRole = await AsyncStorage.getItem("userRole");
    setIsAdmin(userRole === "admin" || userRole === "superAdmin");
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {/* Main App Flow */}
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />

          {/* Dispute Screens */}
          <Stack.Screen name="DisputeList" component={DisputeListScreen} />
          <Stack.Screen name="DisputeDetails" component={DisputeDetailsScreen} />

          {/* Chat Screen */}
          <Stack.Screen name="Chat" component={ChatScreen} />

          {/* Other Screens */}
          <Stack.Screen name="Earnings" component={EarningsScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="SearchNearby" component={SearchNearbyScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{ title: "Edit Profile" }} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: "Change Password" }} />
          <Stack.Screen name="KYCUpdate" component={KYCUpdateScreen} options={{ title: "Update KYC" }} />

          {/* Services Screens */}
          <Stack.Screen name="ServiceList" component={ServiceListScreen} />
          <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />

          {/* Admin Screens (Only if Admin) */}
          {isAdmin && (
            <>
              <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
              <Stack.Screen name="AdminTransactions" component={AdminTransactionScreen} />
              <Stack.Screen name="AdminDisputes" component={AdminDisputeScreen} />
              <Stack.Screen name="AdminUsers" component={AdminUserManagementScreen} />
              <Stack.Screen name="AdminActivityLogs" component={AdminActivityLogsScreen} />
              <Stack.Screen name="AdminUsersList" component={AdminUsersListScreen} />
              <Stack.Screen name="AdminChats" component={AdminChatScreen} />
            </>
          )}
        </>
      ) : (
        // Auth Flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
