const AuthModel = require('./authModel');

exports.registerSync = (req, res) => {
    const { firebaseUid, fullName, email } = req.body;

    // 1. Cek apakah email sudah ada di MySQL
    AuthModel.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered in system' });
        }

        // 2. Jika belum, simpan ke MySQL
        AuthModel.createUser({ firebaseUid, fullName, email }, (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(201).json({ success: true, message: 'User synchronized to Database' });
        });
    });
};

exports.checkUserStatus = (req, res) => {
    const { email } = req.body;
    console.log("Cek Status untuk email:", email);

    AuthModel.findByEmail(email, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: err.message });
        }
        if (results.length === 0) {
            console.log("User TIDAK ditemukan di MySQL");
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log("User DITEMUKAN:", results[0].full_name);
        const user = results[0];
        // Logika untuk menentukan ke Dashboard atau FirstPage (Onboarding)
        // Jika TDEE masih NULL atau 0, berarti belum onboarding
        const isOnboarded = user.calculated_tdee > 0;
        
        res.json({ success: true, isOnboarded, user });
    });
};