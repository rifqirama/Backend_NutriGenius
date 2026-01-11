const db = require('../../config/database'); 

const NotificationModel = {
    getUserData: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, weight_kg, height_cm FROM users WHERE email = ?';
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    getTodayJournal: (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT total_protein FROM daily_journals WHERE user_id = ? AND date = CURDATE()';
            db.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    getWeeklyJournalCount: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT COUNT(*) as count 
                FROM daily_journals 
                WHERE user_id = ? 
                AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            `;
            db.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0].count);
            });
        });
    }
};

module.exports = NotificationModel;