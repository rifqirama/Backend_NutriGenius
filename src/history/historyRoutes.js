const express = require('express');
const router = express.Router();
const historyController = require('./historyController');

router.get('/stats/weekly/:user_id', historyController.getWeeklyStats);

router.delete('/:id', historyController.deleteHistory);

module.exports = router;