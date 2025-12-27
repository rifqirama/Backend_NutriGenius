const express = require('express');
const router = express.Router();
const controller = require('./firstpageController');

router.post('/complete-profile', controller.completeProfile);

module.exports = router;