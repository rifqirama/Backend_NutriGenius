const db = require('../../../../config/database'); 

const ScanHistory = {
    initTable: () => {
        const query = `
            CREATE TABLE IF NOT EXISTS scan_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                foodName VARCHAR(255) NOT NULL,
                calories FLOAT DEFAULT 0,
                protein FLOAT DEFAULT 0,
                carbs FLOAT DEFAULT 0,
                fat FLOAT DEFAULT 0,
                sugar FLOAT DEFAULT 0,
                aiSuggestion TEXT,
                imagePath VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        
        db.query(query, (err) => {
            if (err) console.error("❌ Gagal membuat tabel scan_history:", err.message);
            else console.log("✅ Tabel 'scan_history' siap digunakan (Raw SQL).");
        });
    },

    create: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO scan_history 
                (userId, foodName, calories, protein, carbs, fat, sugar, aiSuggestion, imagePath)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                data.userId,
                data.foodName,
                data.calories,
                data.protein,
                data.carbs,
                data.fat,
                data.sugar,
                data.aiSuggestion,
                data.imagePath
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: result.insertId, ...data });
                }
            });
        });
    }
};

ScanHistory.initTable();

module.exports = ScanHistory;