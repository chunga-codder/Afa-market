const Dispute = require('../models/Dispute');
const Chat = require('../models/Chat');
const Admin = require('../models/Admin');
const Transaction = require('../models/Transaction');

// Controller to assign admin to a dispute
exports.assignAdminToDispute = async (req, res) => {
    try {
        const { adminId } = req.body;
        const { disputeId } = req.params;

        const dispute = await Dispute.findById(disputeId);
        if (!dispute) {
            return res.status(404).json({ success: false, message: 'Dispute not found.' });
        }

        dispute.adminId = adminId;
        dispute.status = 'Pending';
        await dispute.save();

        res.json({ success: true, message: 'Admin assigned to the dispute.' });
    } catch (error) {
        console.error('Error assigning admin to dispute:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Controller to get activity logs for disputes
exports.getActivityLogs = async (req, res) => {
    try {
        const logs = await Dispute.find({}).populate('adminId').sort({ updatedAt: -1 });

        if (!logs) {
            return res.status(404).json({ success: false, message: 'No logs found.' });
        }

        res.json({ success: true, logs });
    } catch (error) {
        console.error('Error retrieving activity logs:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Controller to view all chats between users and admins
exports.viewAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({}).populate('userId').populate('adminId').sort({ createdAt: -1 });

        if (!chats) {
            return res.status(404).json({ success: false, message: 'No chats found.' });
        }

        res.json({ success: true, chats });
    } catch (error) {
        console.error('Error retrieving chats:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Controller to list all admins
exports.listAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).populate('userId');

        if (!admins) {
            return res.status(404).json({ success: false, message: 'No admins found.' });
        }

        res.json({ success: true, admins });
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Controller to release funds during dispute resolution
exports.releaseFundsDuringDispute = async (req, res) => {
    try {
        const { disputeId, decision } = req.body; // decision can be 'approve' or 'reject'
        const dispute = await Dispute.findById(disputeId);

        if (!dispute) {
            return res.status(404).json({ success: false, message: 'Dispute not found.' });
        }

        const transaction = await Transaction.findById(dispute.transactionId);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        // Check if funds have already been released
        if (transaction.status === 'released') {
            return res.status(400).json({ success: false, message: 'Funds have already been released.' });
        }

        // Handle decision: Approve or Reject
        if (decision === 'approve') {
            // Release funds to the user (or agent) as per the dispute resolution
            transaction.status = 'released';
            await transaction.save();

            // Optionally: Notify the involved parties about the fund release
            // sendPushNotification(transaction.userId, 'Funds released', 'Your funds have been released due to dispute resolution.');

            res.json({ success: true, message: 'Funds have been successfully released.' });
        } else if (decision === 'reject') {
            // Reject and freeze the funds
            transaction.status = 'frozen';
            await transaction.save();

            // Optionally: Notify the involved parties about the rejection
            // sendPushNotification(transaction.userId, 'Funds frozen', 'Your funds have been frozen due to dispute resolution.');

            res.json({ success: true, message: 'Funds have been frozen due to the dispute resolution.' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid decision. Choose "approve" or "reject".' });
        }
    } catch (error) {
        console.error('Error releasing funds during dispute:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

const User = require('../models/User');
const Admin = require('../models/Admin');

// Controller to add a user as an admin
exports.addAdmin = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check if the user is already an admin
        const existingAdmin = await Admin.findOne({ userId: userId });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'User is already an admin.' });
        }

        // Create and assign admin role
        const admin = new Admin({ userId: userId });
        await admin.save();

        res.json({ success: true, message: 'User successfully added as an admin.' });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Controller to freeze or unfreeze a user's account
exports.freezeUnfreezeAccount = async (req, res) => {
    try {
        const { userId, action } = req.body; // action can be 'freeze' or 'unfreeze'

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (action === 'freeze') {
            user.isFrozen = true; // Assuming `isFrozen` is a boolean field in the user model
            await user.save();
            res.json({ success: true, message: 'User account has been frozen.' });
        } else if (action === 'unfreeze') {
            user.isFrozen = false;
            await user.save();
            res.json({ success: true, message: 'User account has been unfrozen.' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action. Choose "freeze" or "unfreeze".' });
        }
    } catch (error) {
        console.error('Error freezing/unfreezing account:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

