const User = require("../models/User");

const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
const isValidLongitude = (lon) => lon >= -180 && lon <= 180;

exports.searchNearbyUsers = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 10, page = 1, limit = 10 } = req.body; // Distance in KM

        // Validate inputs
        if (!latitude || !longitude || !isValidLatitude(latitude) || !isValidLongitude(longitude)) {
            return res.status(400).json({ success: false, message: "Invalid latitude or longitude." });
        }
        
        if (maxDistance <= 0) {
            return res.status(400).json({ success: false, message: "Max distance must be greater than zero." });
        }

        const maxDistanceInMeters = maxDistance * 1000; // Convert to meters

        // Perform the query for nearby users
        const nearbyUsers = await User.find({
            isAvailable: true, // Only available users
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: maxDistanceInMeters, // Using meters
                },
            },
        })
        .skip((page - 1) * limit)
        .limit(limit);

        if (nearbyUsers.length === 0) {
            return res.status(404).json({ success: false, message: "No nearby users found." });
        }

        res.json({ success: true, users: nearbyUsers });
    } catch (error) {
        console.error(`Error searching nearby users. Input data: lat=${latitude}, lon=${longitude}, maxDistance=${maxDistance}`, error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
