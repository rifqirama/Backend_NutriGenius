const db = require('../../config/database');

const ProfileModel = {

    getUserByEmail: (email, callback) => {
        const query = `
            SELECT 
                id, email, full_name, gender, birth_date, 
                weight_kg, height_cm, activity_id, health_id, 
                profile_picture, created_at 
            FROM users 
            WHERE email = ?
        `;
        db.query(query, [email], callback);
    },

    updateProfileData: (email, data, callback) => {
        const query = `
            UPDATE users 
            SET 
                full_name = ?,
                gender = ?,
                birth_date = ?,
                weight_kg = ?,
                height_cm = ?,
                activity_id = ?,
                health_id = ?,
                calculated_bmr = ?,
                calculated_tdee = ?,
                updated_at = NOW()
            WHERE email = ?
        `;
        
        const params = [
            data.full_name,
            data.gender,
            data.birth_date,
            data.weight_kg,
            data.height_cm,
            data.activity_id,
            data.health_id,
            data.calculated_bmr,
            data.calculated_tdee,
            email
        ];

        db.query(query, params, callback);
    },

    updateEmail: (oldEmail, newEmail, callback) => {
        const query = `UPDATE users SET email = ?, updated_at = NOW() WHERE email = ?`;
        db.query(query, [newEmail, oldEmail], callback);
    },

    updateProfilePicture: (email, imagePath, callback) => {
        const query = `UPDATE users SET profile_picture = ?, updated_at = NOW() WHERE email = ?`;
        db.query(query, [imagePath, email], callback);
    },

    deleteProfilePicture: (email, callback) => {
        const query = `UPDATE users SET profile_picture = NULL, updated_at = NOW() WHERE email = ?`;
        db.query(query, [email], callback);
    },

    deleteAccount: (email, callback) => {
        const query = `DELETE FROM users WHERE email = ?`;
        db.query(query, [email], callback);
    }
};

module.exports = ProfileModel;