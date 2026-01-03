const db = require('../../config/db');

const ProfileModel = {
    getUserData: (email, callback) => {
        const query = `
            SELECT 
                full_name, email, gender, 
                weight_kg, height_cm, 
                birth_date, 
                activity_id, health_id,
                created_at
            FROM users 
            WHERE email = ?
        `;
        db.query(query, [email], callback);
    }
};

module.exports = ProfileModel;