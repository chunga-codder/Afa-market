const express = require('express');
const  {getEarnings, getEarningsSummary}  = require('../controllers/earningsController');
const {protect}  = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/', [protect], getEarnings);
router.get('/summary', [protect], getEarningsSummary);

module.exports = router;
