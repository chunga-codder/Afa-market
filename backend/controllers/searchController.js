const User = require("../models/User");

exports.searchNearbyUsers = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 10 } = req.body; // Distance in KM

        const nearbyUsers = await User.find({
            isAvailable: true, // Only available users
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: maxDistance * 200000, // Convert to meters
                },
            },
        });

        res.json({ success: true, users: nearbyUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
