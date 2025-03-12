const Earning = require('../models/Earning');

const getEarnings = async (req, res) => {
  try {
    const { id: providerId } = req.user;
    if (!providerId) {
      return res.status(400).json({ success: false, message: 'Provider ID is missing' });
    }

    const earnings = await Earning.find({ providerId }).sort({ date: -1 });
    res.json({ success: true, earnings });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getEarningsSummary = async (req, res) => {
  try {
    const { id: providerId } = req.user;
    if (!providerId) {
      return res.status(400).json({ success: false, message: 'Provider ID is missing' });
    }

    const earnings = await Earning.aggregate([
      { $match: { providerId } },
      {
        $project: {
          amount: 1,
          date: 1,
          day: { $dayOfMonth: "$date" },
          week: { $week: "$date" },
          month: { $month: "$date" }
        }
      },
      {
        $facet: {
          daily: [{ $match: { day: { $eq: new Date().getDate() } } }, { $group: { _id: null, total: { $sum: "$amount" } } }],
          weekly: [{ $match: { week: { $eq: new Date().getWeek() } } }, { $group: { _id: null, total: { $sum: "$amount" } } }],
          monthly: [{ $match: { month: { $eq: new Date().getMonth() } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]
        }
      }
    ]);

    res.json({ success: true, summary: earnings[0] });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports={ getEarnings, getEarningsSummary}
