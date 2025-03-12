const axios = require('axios');
const redis = require('redis');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const redisClient = redis.createClient(); // Initialize Redis client

// Ensure Redis is connected
redisClient.on('error', (err) => console.error('Redis error:', err));

/**
 * Search for nearby service providers using Google Places API + MongoDB
 */
const searchNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude, serviceType, radius = 5000, page = 1 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const cacheKey = `nearby_${latitude}_${longitude}_${radius}_${serviceType || 'all'}`;

    // Check Redis Cache First
    redisClient.get(cacheKey, async (err, cachedData) => {
      if (err) console.error('Redis Error:', err);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData)); // Return cached response
      }

      // Call Google Places API
      const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=point_of_interest&key=${GOOGLE_API_KEY}`;
      const googleResponse = await axios.get(googlePlacesUrl);
      const nearbyPlaces = googleResponse.data.results;

      // Search for service providers in the database
      const query = {
        location: { $near: { $geometry: { type: 'Point', coordinates: [longitude, latitude] }, $maxDistance: radius } },
        isAvailable: true, // Only available providers
      };

      if (serviceType) query.serviceType = serviceType; // Filter by service type if provided

      const limit = 10; // Pagination limit
      const usersNearby = await User.find(query).limit(limit).skip((page - 1) * limit);

      const responseData = { nearbyPlaces, usersNearby, currentPage: page };

      // Cache result for 10 minutes
      redisClient.setex(cacheKey, 600, JSON.stringify(responseData));

      res.json(responseData);
    });
  } catch (error) {
    console.error('Error in searchNearbyUsers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { searchNearbyUsers };
