const Analytics = require('../models/Analytics');

exports.getAnalytics = async (req, res) => {
  try {
    const providerId = req.user.id;
    const analytics = await Analytics.findOne({ providerId });

    if (!analytics) {
      return res.json({ success: true, analytics: { totalReviews: 0, averageRating: 0, satisfactionScore: 0 } });
    }

    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
