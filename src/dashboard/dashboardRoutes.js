const express = require('express');
const router = express.Router();
const controller = require('./dashboardController');

router.post('/', controller.getDashboardData);

module.exports = router;