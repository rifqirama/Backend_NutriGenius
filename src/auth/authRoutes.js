const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.post('/sync-register', authController.registerSync); // Dipanggil setelah Firebase Register sukses
router.post('/check-status', authController.checkUserStatus); // Dipanggil saat Login

module.exports = router;