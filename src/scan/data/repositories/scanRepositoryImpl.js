// src/scan/data/repositories/scanRepositoryImpl.js

const db = require('../../../../config/database'); // Pastikan path ini benar-benar tepat

class ScanRepositoryImpl {
  async getUserProfileForAi(userId) {
  const query = `
    SELECT 
      u.calculated_tdee as tdee, 
      h.condition_name as health_condition, 
      h.sugar_limit_g as sugar_limit
    FROM users u
    LEFT JOIN master_health_conditions h ON u.health_id = h.id
    WHERE u.id = ?`;
  const [rows] = await db.execute(query, [userId]);
  return rows[0];
}

  async saveAnalysisResult(userId, data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        "INSERT IGNORE INTO daily_journals (user_id, date) VALUES (?, CURDATE())", 
        [userId]
      );
      
      const [currentJournal] = await connection.execute(
        "SELECT id FROM daily_journals WHERE user_id = ? AND date = CURDATE()", 
        [userId]
      );
      
      if (currentJournal.length === 0) throw new Error("Gagal membuat jurnal harian.");
      const journalId = currentJournal[0].id;

      // 2. Simpan ke journal_details
      // Catatan: Pastikan field di 'data' sesuai dengan respon dari GeminiService
      await connection.execute(
        `INSERT INTO journal_details (journal_id, food_name, calories, protein, carbs, fat, sugar) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [journalId, data.food_name, data.calories, data.protein, data.carbs, data.fat, data.sugar]
      );

      await connection.commit();
      return { journalId, ...data };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = ScanRepositoryImpl;