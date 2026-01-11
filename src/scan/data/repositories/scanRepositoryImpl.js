const db = require('../../../../config/database'); 

class ScanRepositoryImpl {
  
  async getUserProfileForAi(email) {
    const query = `
      SELECT 
        calculated_tdee as tdee, 
        health_id 
      FROM users 
      WHERE email = ?
    `;
    
    const [rows] = await db.execute(query, [email]);
    
    if (rows.length === 0) return {};

    const user = rows[0];

    let condition = "Normal";
    if (user.health_id === 2) condition = "Diabetes";
    if (user.health_id === 3) condition = "Obesitas";

    return {
      tdee: user.tdee,
      health_condition: condition,
      sugar_limit: user.health_id === 2 ? 25 : 50 
    };
  }

  async saveAnalysisResult(email, imagePath, filename, data) {

    const query = `
      INSERT INTO history 
      (email, food_name, calories, protein, carbs, fat, sugar, image_path, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      email,
      data.food_name || "Makanan Tidak Teridentifikasi",
      data.calories || 0,
      data.protein || 0,
      data.carbs || 0,
      data.fat || 0,
      data.sugar || 0,
      filename
    ];

    const [result] = await db.execute(query, params);

    return {
      id: result.insertId,
      email: email,
      image_path: filename,
      ...data
    };
  }

  saveScanToJournal(userId, scanData) {
    return new Promise(async (resolve, reject) => {
      try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Create or get today's daily_journal
        const journalQuery = `
          INSERT INTO daily_journals (user_id, date, total_calories, total_protein, total_carbs, total_fat)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            total_calories = total_calories + VALUES(total_calories),
            total_protein = total_protein + VALUES(total_protein),
            total_carbs = total_carbs + VALUES(total_carbs),
            total_fat = total_fat + VALUES(total_fat)
        `;

        const journalParams = [
          userId,
          today,
          scanData.calories || 0,
          scanData.protein || 0,
          scanData.carbs || 0,
          scanData.fat || 0
        ];

        db.query(journalQuery, journalParams, (err, journalResult) => {
          if (err) {
            console.error("❌ Daily Journal Error:", err);
            return reject(new Error(`Gagal membuat jurnal harian: ${err.message}`));
          }

          // Get the journal_id (either created or existing)
          const getJournalQuery = `
            SELECT id FROM daily_journals 
            WHERE user_id = ? AND date = ?
          `;

          db.query(getJournalQuery, [userId, today], (err, journalRows) => {
            if (err || !journalRows || journalRows.length === 0) {
              console.error("❌ Get Journal Error:", err);
              return reject(new Error("Gagal mendapatkan jurnal harian"));
            }

            const journalId = journalRows[0].id;

            // 2. Insert into food_logs
            const foodLogQuery = `
              INSERT INTO food_logs (email, food_name, calories, protein, carbs, fat)
              VALUES (
                (SELECT email FROM users WHERE id = ?),
                ?, ?, ?, ?, ?
              )
            `;

            const foodLogParams = [
              userId,
              scanData.foodName || "Makanan Tidak Teridentifikasi",
              Math.round(scanData.calories) || 0,
              Math.round(scanData.protein) || 0,
              Math.round(scanData.carbs) || 0,
              Math.round(scanData.fat) || 0
            ];

            db.query(foodLogQuery, foodLogParams, (err, foodLogResult) => {
              if (err) {
                console.error("❌ Food Log Error:", err);
                return reject(new Error(`Gagal menyimpan food log: ${err.message}`));
              }

              // 3. Insert into journal_details (default meal_type_id = 4 for Snack)
              const journalDetailQuery = `
                INSERT INTO journal_details 
                (journal_id, meal_type_id, food_name, calories, protein, carbs, fat, sugar, aiSuggestion, imagePath)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

              const journalDetailParams = [
                journalId,
                4, // Snack / Camilan as default meal type
                scanData.foodName || "Makanan Tidak Teridentifikasi",
                Math.round(scanData.calories) || 0,
                Math.round(scanData.protein) || 0,
                Math.round(scanData.carbs) || 0,
                Math.round(scanData.fat) || 0,
                Math.round(scanData.sugar) || 0,
                scanData.aiSuggestion || "",
                scanData.imagePath || ""
              ];

              db.query(journalDetailQuery, journalDetailParams, (err, detailResult) => {
                if (err) {
                  console.error("❌ Journal Detail Error:", err);
                  return reject(new Error(`Gagal menyimpan detail jurnal: ${err.message}`));
                }

                resolve({
                  success: true,
                  journalId: journalId,
                  foodLogId: foodLogResult.insertId,
                  detailId: detailResult.insertId,
                  data: {
                    ...scanData,
                    date: today
                  }
                });
              });
            });
          });
        });

      } catch (error) {
        console.error("❌ Repository Error:", error);
        reject(new Error(`Gagal menyimpan ke database: ${error.message}`));
      }
    });
  }
}

module.exports = ScanRepositoryImpl;