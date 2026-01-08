const db = require('../../config/database');

const NotificationModel = {
    getByEmail: (email, callback) => {
        // Ambil notifikasi urut dari yang paling baru
        const query = `SELECT * FROM notifications WHERE email = ? ORDER BY created_at DESC`;
        db.query(query, [email], callback);
    }
};

module.exports = NotificationModel;