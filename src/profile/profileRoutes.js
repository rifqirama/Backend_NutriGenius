const express = require('express');
const router = express.Router();
const profileController = require('./profileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/profiles/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Nama file unik: user_timestamp.jpg
        cb(null, 'profile_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 1. LIHAT PROFIL (GET)
router.get('/me', profileController.getUserProfile);

// 2. UPDATE PROFIL (PUT)
router.put('/update', profileController.updateUserProfile);

// 3. GANTI PASSWORD (PUT)
router.put('/change-password', profileController.changePassword);

// 4. HAPUS AKUN (DELETE)
router.delete('/delete-account', profileController.deleteAccount);

// 5. UPLOAD FOTO PROFIL (POST)
router.post('/upload-photo', upload.single('image'), profileController.uploadPhoto);

module.exports = router;