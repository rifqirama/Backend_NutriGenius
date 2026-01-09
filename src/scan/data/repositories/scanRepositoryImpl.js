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
}

module.exports = ScanRepositoryImpl;