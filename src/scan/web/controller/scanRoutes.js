const express = require('express');
const router = express.Router();
const scanController = require('./scanController');
const multer = require('multer');

// Setup Multer untuk simpan di memori (supaya ada .buffer)
const upload = multer({ storage: multer.memoryStorage() });
// Pastikan field name 'image' sama persis dengan yang di Flutter
router.post('/analyze', upload.single('image'), scanController.processScan);

module.exports = router;