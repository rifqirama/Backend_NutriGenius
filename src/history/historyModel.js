const db = require('../../config/database');

const HistoryModel = {
    getAllByEmail: (email, callback) => {
        const query = `
            SELECT 
                sh.id, 
                sh.foodName AS food_name,    -- Alias biar cocok sama Frontend (snake_case)
                sh.calories, 
                sh.protein,
                sh.carbs,
                sh.fat,
                sh.sugar,
                sh.imagePath AS image_path,  -- Alias lagi
                sh.createdAt AS date,
                -- ⚠️ PENTING: Kita TIDAK ambil 'aiSuggestion' disini biar loading cepat!
                u.email
            FROM journal_details sh
            JOIN users u ON sh.userId = u.id
            WHERE u.email = ?
            ORDER BY sh.createdAt DESC
        `;
        
        db.query(query, [email], callback);
    },

    getDetailById: (id, callback) => {
        const query = `
            SELECT 
                id, foodName AS food_name, calories, protein, carbs, fat, sugar, 
                aiSuggestion AS ai_suggestion, -- Nah, disini baru kita ambil teks panjangnya
                imagePath AS image_path, createdAt AS date 
            FROM journal_details 
            WHERE id = ?
        `;
        db.query(query, [id], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM journal_details WHERE id = ?';
        db.query(query, [id], callback);
    }
};

module.exports = HistoryModel;