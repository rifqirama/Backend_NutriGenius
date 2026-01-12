const db = require('../../config/database');

const DashboardModel = {

getUserProfile: (email, callback) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        
        db.query(query, [email], callback);
    }
};

module.exports = DashboardModel;