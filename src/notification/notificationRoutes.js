const express = require('express');
const router = express.Router();
const controller = require('./notificationController');

// Kita pakai POST biar sama kayak Dashboard & FirstPage
router.post('/', controller.getNotifications);

module.exports = router;