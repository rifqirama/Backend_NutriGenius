const db = require('../../../../config/database');

class DashboardRepositoryImpl {
  
  getUserProfile(email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`;
      
      db.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results && results.length > 0 ? results[0] : null);
        }
      });
    });
  }

  getUserTodayScanHistory(userId) {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      
      const query = `
        SELECT 
          jd.calories, 
          jd.protein, 
          jd.carbs, 
          jd.fat, 
          jd.sugar,
          jd.scan_timestamp
        FROM journal_details jd
        INNER JOIN daily_journals dj ON jd.journal_id = dj.id
        WHERE dj.user_id = ? 
        AND DATE(dj.date) = ?
        ORDER BY jd.scan_timestamp DESC
      `;
      
      db.query(query, [userId, today], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results || []);
        }
      });
    });
  }

  getUserDailyJournal(userId) {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      
      const query = `
        SELECT 
          id,
          total_calories, 
          total_protein, 
          total_carbs, 
          total_fat
        FROM daily_journals
        WHERE user_id = ? 
        AND date = ?
        LIMIT 1
      `;
      
      db.query(query, [userId, today], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results && results.length > 0 ? results[0] : null);
        }
      });
    });
  }
}

module.exports = DashboardRepositoryImpl;