const express = require('express');
const router = express.Router();
const controller = require('./firstpageController');

router.get('/activities', controller.getActivities);
router.get('/health-conditions', controller.getHealthConditions);
router.post('/complete-profile', controller.completeProfile);

module.exports = router;