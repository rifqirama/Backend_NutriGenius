const db = require('../../config/database');

const DashboardModel = {
    // Ambil data user untuk ditampilkan di Dashboard
getUserProfile: (email, callback) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        
        db.query(query, [email], callback);
    }
};

module.exports = DashboardModel;