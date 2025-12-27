const db = require('../../config/database');

const DashboardModel = {
    // Ambil data user untuk ditampilkan di Dashboard
    getUserProfile: (email, callback) => {
        const query = `
            SELECT 
                email, 
                name, 
                gender, 
                birth_date, 
                weight_kg, 
                height_cm, 
                activity_id, 
                health_id, 
                calculated_bmr, 
                calculated_tdee 
            FROM users 
            WHERE email = ?
        `;
        db.query(query, [email], callback);
    }
};

module.exports = DashboardModel;