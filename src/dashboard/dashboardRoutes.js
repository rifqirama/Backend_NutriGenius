const express = require('express');
const router = express.Router();
const controller = require('./dashboardController');

// Method GET karena kita mau MENGAMBIL data
router.get('/get-data', controller.getDashboardData);

module.exports = router;