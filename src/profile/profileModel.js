const db = require('../../config/database');

const ProfileModel = {
    updateProfile: (data, callback) => {
        const query = `
            UPDATE users 
            SET full_name = ?, weight_kg = ?, height_cm = ?, gender = ?, birth_date = ? 
            WHERE email = ?
        `;
        db.query(
            query, 
            [data.name, data.weight, data.height, data.gender, data.birth_date, data.email], 
            callback
        );
    }
};

module.exports = ProfileModel;