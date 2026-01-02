const db = require('../../config/database');

const ProfileModel = {
    // 1. AMBIL PROFIL
    getProfileByEmail: (email, callback) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.query(query, [email], callback);
    },

    // 2. UPDATE PROFIL
    updateProfile: (email, data, callback) => {
        const query = `
            UPDATE users 
            SET 
                full_name = ?, 
                weight_kg = ?, 
                height_cm = ?, 
                gender = ?, 
                birth_date = ?, 
                health_id = ?
            WHERE email = ?
        `;
        
        db.query(
            query, 
            [data.full_name, data.weight_kg, data.height_cm, data.gender, data.birth_date, data.health_id, email], 
            callback
        );
    },

    // 3. AMBIL PASSWORD LAMA (Untuk Verifikasi sebelum ganti)
    getPasswordById: (userId, callback) => {
        const query = `SELECT password FROM users WHERE user_id = ?`;
        db.query(query, [userId], callback);
    },

    // 4. UPDATE PASSWORD
    updatePassword: (userId, newPassword, callback) => {
        const query = `UPDATE users SET password = ? WHERE user_id = ?`;
        db.query(query, [newPassword, userId], callback);
    },

    // 5. HAPUS AKUN PERMANEN
    deleteAccount: (email, callback) => {
        const query = `DELETE FROM users WHERE email = ?`;
        db.query(query, [email], callback);
    }
};

module.exports = ProfileModel;