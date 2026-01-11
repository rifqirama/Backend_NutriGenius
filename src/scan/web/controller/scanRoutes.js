const express = require('express');
const router = express.Router();
const scanController = require('./scanController'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
router.get('/history', scanController.getHistory);
router.delete('/delete/:id', scanController.deleteHistory);

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
        console.log("📸 Menerima file dengan tipe:", file.mimetype);

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Format file tidak didukung! Pastikan upload GAMBAR.'));
        }
    }
});

router.post('/analyze', upload.single('image'), scanController.processScan);
router.post('/save', scanController.saveScanResult);

module.exports = router;