const express = require('express');
const router = express.Router();
const controller = require('./profileController');

router.post('/', controller.getUserProfile);

module.exports = router;