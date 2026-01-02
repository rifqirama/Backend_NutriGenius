const ProfileModel = require('./profileModel');
const bcrypt = require('bcryptjs');

exports.getUserProfile = (req, res) => {
    const email = req.query.email || req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email wajib dikirim' });
    }

    ProfileModel.getProfileByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });
        
        if (!results || results.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const user = results[0];

        // Format Data untuk Flutter (Sesuai ProfileModel.dart)
        const responseData = {
            full_name: user.full_name,
            email: user.email,
            gender: user.gender,
            birth_date: user.birth_date,
            weight_kg: user.weight_kg,
            height_cm: user.height_cm,
            
            // Kita kirim id juga, siapa tahu nanti butuh buat update
            user_id: user.user_id 
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    });
};

// 2. UPDATE PROFILE (PUT)
exports.updateUserProfile = (req, res) => {

    const { email, full_name, weight_kg, height_cm, gender, birth_date, health_id } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email wajib ada!' });
    }

    const updateData = {
        full_name: full_name,
        weight_kg: weight_kg,
        height_cm: height_cm,
        gender: gender,
        birth_date: birth_date,
        health_id: health_id,
    };

    ProfileModel.updateProfile(email, updateData, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal update database', error: err });
        }

        // Cek apakah ada baris yang berubah
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan atau data sama' });
        }

        res.status(200).json({
            success: true,
            message: 'Profil berhasil diperbarui!',
            data: updateData
        });
    });
};

// 3. GANTI PASSWORD (PUT)
exports.changePassword = (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    // A. Cari user dulu untuk ambil password lama (hash)
    ProfileModel.getProfileByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const user = results[0];

        // B. Bandingkan Password Lama input user vs Hash di Database
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password lama salah!' });
        }

        // C. Hash Password Baru
        const salt = bcrypt.genSaltSync(10);
        const newHash = bcrypt.hashSync(newPassword, salt);

        // D. Simpan ke Database
        ProfileModel.updatePassword(user.user_id, newHash, (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'Gagal update password' });
            
            res.status(200).json({ success: true, message: 'Password berhasil diganti!' });
        });
    });
};

// 4. HAPUS AKUN (DELETE)
exports.deleteAccount = (req, res) => {
    // Bisa dari query (?email=...) atau body
    const email = req.body.email || req.query.email;

    if (!email) return res.status(400).json({ success: false, message: 'Email wajib ada' });

    ProfileModel.deleteAccount(email, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        res.status(200).json({ success: true, message: 'Akun berhasil dihapus selamanya.' });
    });
};

// 5. UPLOAD PROFILE PICTURE (POST)
exports.uploadPhoto = (req, res) => {
    const email = req.body.email;
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
    }

    // Path yang disimpan di database (misal: uploads/profiles/abc.jpg)
    const imagePath = req.file.path.replace(/\\/g, "/");

    // Update kolom profile_picture di database users
    const query = `UPDATE users SET profile_picture = ? WHERE email = ?`;
    
    const db = require('../../config/database');
    
    db.query(query, [imagePath, email], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal update DB', error: err });
        
        res.status(200).json({
            success: true,
            message: 'Foto berhasil diupload',
            data: { profile_picture: imagePath }
        });
    });
};