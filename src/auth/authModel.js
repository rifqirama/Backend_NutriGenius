const db = require('../../config/database');

const AuthModel = {
    // Cari user berdasarkan email
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], callback);
    },

    // Simpan user baru (Sinkronisasi dari Firebase)
    createUser: (userData, callback) => {
        const query = `
            INSERT INTO users (firebase_uid, full_name, email, gender, birth_date, weight_kg, height_cm)
            VALUES (?, ?, ?, 'Laki-laki', '2000-01-01', 0, 0) 
        `;
        // Note: Data dummy dulu untuk birth_date dll, nanti diupdate di FirstPage (Onboarding)
        db.query(query, [userData.firebaseUid, userData.fullName, userData.email], callback);
    }
};

module.exports = AuthModel;