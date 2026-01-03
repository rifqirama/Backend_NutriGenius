const express = require('express');
const router = express.Router();
const historyController = require('./historyController');

router.get('/list', historyController.getHistory);
router.post('/add', historyController.addHistory);
router.delete('/delete/:id', historyController.deleteHistory);

module.exports = router;