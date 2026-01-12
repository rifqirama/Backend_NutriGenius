const express = require('express');
const router = express.Router();
const controller = require('./profileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/profiles';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        console.log("Mencoba upload file:", file.originalname);
        console.log("MimeType yang diterima:", file.mimetype);

        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExts = ['.jpeg', '.jpg', '.png', '.webp'];

        if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            console.log("Ditolak karena format salah!");
            cb(new Error(`Format ${file.mimetype} tidak diizinkan! Hanya JPG, PNG, WEBP.`));
        }
    }
});

router.get('/', controller.getProfile); 
router.put('/update', controller.updateProfile);

router.post('/upload-photo', upload.single('image'), controller.uploadPhoto);

router.delete('/delete-photo', controller.deletePhoto);
router.delete('/delete-account', controller.deleteAccount);

module.exports = router;