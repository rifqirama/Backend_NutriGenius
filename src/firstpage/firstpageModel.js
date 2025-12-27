const db = require('../../config/database');

const FirstPageModel = {
    updateProfile: (email, data, callback) => {
        const query = `
            UPDATE users 
            SET 
                gender = ?, 
                birth_date = ?, 
                weight_kg = ?, 
                height_cm = ?, 
                activity_id = ?, 
                health_id = ?,
                calculated_bmr = ?,
                calculated_tdee = ?
            WHERE email = ?
        `;

        const values = [
            data.gender,
            data.birthDate,
            data.weight,
            data.height,
            data.activityId,
            data.healthId,
            data.bmr,
            data.tdee,
            email
        ];

        db.query(query, values, callback);
    }
};

module.exports = FirstPageModel;