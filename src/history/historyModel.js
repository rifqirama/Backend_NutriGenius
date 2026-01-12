const db = require('../../config/database');

const HistoryModel = {
    getAllByEmail: (email, callback) => {
        const query = `
            SELECT 
                sh.id, 
                sh.food_name,               -- Pakai snake_case sesuai image_79d60a
                sh.calories, 
                sh.protein,
                sh.carbs,
                sh.fat,
                sh.sugar,
                sh.image_path,              -- Pakai snake_case sesuai image_79d60a
                m.meal_name,                -- Ambil teks dari master_meal_types
                sh.scan_timestamp AS date,  -- Pakai scan_timestamp sesuai image_79d60a
                u.email
            FROM journal_details sh
            JOIN users u ON sh.userId = u.id
            LEFT JOIN master_meal_types m ON sh.meal_type_id = m.id
            WHERE u.email = ?
            ORDER BY sh.scan_timestamp DESC
        `;
        
        db.query(query, [email], callback);
    },

    getDetailById: (id, callback) => {
        const query = `
            SELECT 
                sh.id, 
                sh.food_name, 
                sh.calories, sh.protein, sh.carbs, sh.fat, sh.sugar, 
                sh.ai_suggestion, 
                sh.image_path,
                m.meal_name, 
                sh.scan_timestamp AS date 
            FROM journal_details sh
            LEFT JOIN master_meal_types m ON sh.meal_type_id = m.id
            WHERE sh.id = ?
        `;
        db.query(query, [id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM journal_details WHERE id = ?';
        db.query(query, [id], callback);
    }
};

module.exports = HistoryModel;