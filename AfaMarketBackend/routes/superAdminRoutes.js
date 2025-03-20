const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middlewares/authMiddleware');
const {changeUserRole}  = require('../controllers/adminController');       // To change the user's role (including to admin)          // Explicitly adding a user as an admin (if needed)
// Assign an admin to a dispute
router.put('/dispute/:disputeId/assign-admin', [protect, authorizeAdmin], adminController.assignAdminToDispute);

// Delete a user account
router.delete('/user/:userId', [protect, authorizeAdmin], adminController.deleteUserAccount);

// List all users
router.get('/users', [protect, authorizeAdmin], adminController.listAllUsers);

// Change user role
router.put('/user/change-role', [protect, authorizeAdmin], adminController.changeUserRole);

// Get activity logs for disputes
router.get('/disputes/activity-logs', [protect, authorizeAdmin], adminController.getActivityLogs);

// View all chats between users and admins
router.get('/chats', [protect, authorizeAdmin], adminController.viewAllChats);

// List all admins
router.get('/admins', [protect, authorizeAdmin], adminController.listAllAdmins);

// Release funds during dispute resolution
router.post('/dispute/release-funds', [protect, authorizeAdmin], adminController.releaseFundsDuringDispute);

// Add a user as an admin
router.post('/admin/add', [protect, authorizeAdmin], adminController.addAdmin);

// Route to change user role (to admin or other roles)
router.put('/change-role',[protect, authorizeAdmin], changeUserRole);
// Freeze or unfreeze a user's account
router.put('/user/freeze-unfreeze', [protect, authorizeAdmin], adminController.freezeUnfreezeAccount);

module.exports = router;
