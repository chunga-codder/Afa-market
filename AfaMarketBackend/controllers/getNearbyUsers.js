// controllers/nearbyUsersController.js
const User = require('../models/User'); // Assuming a User model exists

const getNearbyUsers = async (latitude, longitude) => {
  try {
    // Use MongoDB geospatial query to find nearby users within a radius
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // longitude, latitude order
          },
          $maxDistance: 10000, // Max distance in meters (e.g., 10km)
        },
      },
    });

    // You can modify the data if needed, e.g., calculate distances
    return users;
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    throw error;
  }
};

module.exports = { getNearbyUsers };
