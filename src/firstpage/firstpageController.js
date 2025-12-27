const FirstPageModel = require('./firstPageModel');

exports.completeProfile = (req, res) => {
    const { email, gender, birthDate, weight, height, activityId, healthId, bmr, tdee } = req.body;

    // Pastikan semua data wajib ada
    if (!email || !weight || !height || !birthDate) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    const userData = { gender, birthDate, weight, height, activityId, healthId, bmr, tdee };

    FirstPageModel.updateProfile(email, userData, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.status(200).json({ success: true, message: 'Profile updated' });
    });
};