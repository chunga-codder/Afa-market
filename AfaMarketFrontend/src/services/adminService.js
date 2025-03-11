import api from "./apiService"; // Assuming you have a base API service

export const releaseFundsDuringDispute = async (disputeId) => {
  try {
    const response = await api.post(`/admin/release-funds`, { disputeId });
    return response.data;
  } catch (error) {
    console.error("Error releasing funds:", error);
    return false;
  }
};

export const changeUserRole = (userId, newRole) => {
    return adminService.put('/user/role', { userId, newRole });
  };
  
  export const deleteUserAccount = (userId) => {
    return adminService.delete(`/user/${userId}/delete`);
  };
  

export const addAdmin = async (userId) => {
  try {
    const response = await api.post(`/admin/add-admin`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error adding admin:", error);
    return false;
  }
};

export const freezeUnfreezeUser = async (userId) => {
  try {
    const response = await api.post(`/admin/freeze-unfreeze`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error freezing/unfreezing user:", error);
    return false;
  }
};

export const approveTransaction = async (transactionId) => {
  try {
    const response = await api.post(`/admin/approve`, { transactionId });
    return response.data;
  } catch (error) {
    console.error("Error approving transaction:", error);
    return false;
  }
};

export const rejectTransaction = async (transactionId) => {
  try {
    const response = await api.post(`/admin/reject`, { transactionId });
    return response.data;
  } catch (error) {
    console.error("Error rejecting transaction:", error);
    return false;
  }
};

export const assignAdminToDispute = async (disputeId, adminId) => {
  try {
    const response = await api.post(`/admin/assign-admin-to-dispute/${disputeId}`, { adminId });
    return response.data;
  } catch (error) {
    console.error("Error assigning admin to dispute:", error);
    return false;
  }
};

export const getActivityLogs = async () => {
  try {
    const response = await api.get(`/admin/activity-logs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};

export const viewAllChats = async () => {
  try {
    const response = await api.get(`/admin/view-chats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const listAllAdmins = async () => {
  try {
    const response = await api.get(`/admin/admins`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

export const listAllUsers = () => {
    return adminService.get('/users');
  };