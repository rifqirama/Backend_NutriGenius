const ProfileModel = require('./profileModel');
const fs = require('fs');
const path = require('path');

const calculateAge = (birthDate) => {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

const calculateMetrics = (gender, weight, height, age, activityId) => {

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'Laki-laki') ? 5 : -161;

    const multipliers = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
    const factor = multipliers[activityId] || 1.2;
    
    return {
        bmr: bmr,
        tdee: bmr * factor
    };
};

exports.getProfile = (req, res) => {
    const email = req.query.email || req.body.email;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    ProfileModel.getUserByEmail(email, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });
        if (result.length === 0) return res.status(404).json({ success: false, message: "User not found" });

        const user = result[0];

        user.age = calculateAge(user.birth_date);
        
        if (user.profile_picture) {

            user.profile_picture_url = `/uploads/profiles/${user.profile_picture}`;
        }

        res.status(200).json({ success: true, data: user });
    });
};

exports.updateProfile = (req, res) => {
    const { email, full_name, gender, birth_date, weight_kg, height_cm, activity_id, health_id } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const age = calculateAge(birth_date);
    const metrics = calculateMetrics(gender, parseFloat(weight_kg), parseFloat(height_cm), age, parseInt(activity_id));

    const updateData = {
        full_name,
        gender,
        birth_date,
        weight_kg: parseFloat(weight_kg),
        height_cm: parseFloat(height_cm),
        activity_id: parseInt(activity_id),
        health_id: parseInt(health_id),
        calculated_bmr: metrics.bmr,
        calculated_tdee: metrics.tdee
    };

    ProfileModel.updateProfileData(email, updateData, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });
        res.status(200).json({ 
            success: true, 
            message: "Profil berhasil diperbarui & Nutrisi dihitung ulang!",
            data: updateData
        });
    });
};

exports.uploadPhoto = (req, res) => {
    const email = req.body.email;
    if (!req.file) return res.status(400).json({ success: false, message: "Tidak ada file yang diupload" });

    const filename = req.file.filename;

    ProfileModel.getUserByEmail(email, (err, result) => {
        if (!err && result.length > 0 && result[0].profile_picture) {
            const oldPath = path.join(__dirname, '../../uploads/profiles', result[0].profile_picture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        ProfileModel.updateProfilePicture(email, filename, (errUpdate) => {
            if (errUpdate) return res.status(500).json({ success: false, error: errUpdate });
            res.status(200).json({ 
                success: true, 
                message: "Foto profil berhasil diupload", 
                filename: filename 
            });
        });
    });
};

exports.deletePhoto = (req, res) => {
    const email = req.query.email || req.body.email;
    
    ProfileModel.getUserByEmail(email, (err, result) => {
        if (!err && result.length > 0 && result[0].profile_picture) {
            const oldPath = path.join(__dirname, '../../uploads/profiles', result[0].profile_picture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        ProfileModel.deleteProfilePicture(email, (errDel) => {
            if (errDel) return res.status(500).json({ success: false, error: errDel });
            res.status(200).json({ success: true, message: "Foto profil dihapus" });
        });
    });
};

exports.deleteAccount = (req, res) => {
    const email = req.query.email || req.body.email;

    ProfileModel.getUserByEmail(email, (err, result) => {
        if (!err && result.length > 0 && result[0].profile_picture) {
            const oldPath = path.join(__dirname, '../../uploads/profiles', result[0].profile_picture);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        ProfileModel.deleteAccount(email, (errDel) => {
            if (errDel) return res.status(500).json({ success: false, error: errDel });
            res.status(200).json({ success: true, message: "Akun berhasil dihapus permanen" });
        });
    });
};