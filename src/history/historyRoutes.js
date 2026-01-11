const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const scanController = require('../scan/web/controller/scanController'); 
const historyController = require('./historyController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/scans';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'scan-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Format file tidak didukung! Pastikan upload GAMBAR.'));
        }
    }
});

router.post('/analyze', upload.single('image'), scanController.processScan);
router.post('/save', scanController.saveScanResult);

router.get('/', historyController.getHistory); 

router.delete('/:id', historyController.deleteHistory);

router.post('/add', historyController.addHistory);

module.exports = router;