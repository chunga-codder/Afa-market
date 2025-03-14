const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/earnings/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ referralEarnings: user.referralEarnings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
