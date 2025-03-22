const NodeCache = require("node-cache");
const axios = require("axios");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Initialize NodeCache with 10-minute TTL and cache check on startup
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Search Nearby Users and Places API
 * @param {Object} req - Request object containing latitude, longitude, serviceType, and radius.
 * @param {Object} res - Response object.
 */
const searchNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude, serviceType, radius = 5000, page = 1 } = req.body;

    // Validate request parameters
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const cacheKey = `nearby_${latitude}_${longitude}_${radius}_${serviceType || "all"}_page${page}`;

    // Check Cache First
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return res.json(cachedData);
    }

    console.log(`⚠️ Cache miss for ${cacheKey}, fetching fresh data...`);

    // Construct Google Places API URL
    const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=point_of_interest&key=${GOOGLE_API_KEY}`;

    // Fetch Nearby Places (Google API) and MongoDB users in parallel
    const [googlePlacesData, usersNearby] = await Promise.all([
      axios.get(googlePlacesUrl).then((res) => res.data.results || []).catch((err) => {
        console.error("❌ Google Places API Error:", err.response?.data || err.message);
        return [];
      }),
      User.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: radius,
          },
        },
        isAvailable: true,
        ...(serviceType ? { serviceType } : {}),
      })
        .limit(10)
        .skip((page - 1) * 10)
        .catch((err) => {
          console.error("❌ MongoDB Query Error:", err);
          return [];
        }),
    ]);

    const responseData = { nearbyPlaces: googlePlacesData, usersNearby, currentPage: page };

    // Store in Cache
    cache.set(cacheKey, responseData, 600);

    res.json(responseData);
  } catch (error) {
    console.error("❌ Error in searchNearbyUsers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { searchNearbyUsers };


// ✅ Geolocation API (gets user’s location)
// ✅ Places API (finds nearby places/users)
// ✅ Distance Matrix API (calculates distance)