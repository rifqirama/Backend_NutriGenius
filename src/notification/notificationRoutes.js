const express = require('express');
const router = express.Router();
const notificationController = require('./notificationController');

// Endpoint: /api/notifications
router.get('/', notificationController.getNotifications);

module.exports = router;