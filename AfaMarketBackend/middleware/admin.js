const User = require("../models/User");

exports.admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "You do not have admin privileges" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
