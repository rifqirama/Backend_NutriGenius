const db = require('../../config/database');

const HistoryModel = {
    getAllByEmail: (email, callback) => {
        const query = 'SELECT * FROM history WHERE email = ? ORDER BY created_at DESC';
        db.query(query, [email], callback);
    },

    create: (data, callback) => {
        const query = `
            INSERT INTO history 
            (email, food_name, calories, protein, carbs, fat, sugar, image_path, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [
            data.email, data.food_name, data.calories, 
            data.protein, data.carbs, data.fat, 
            data.sugar, data.image_path, data.created_at
        ], callback);
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM history WHERE id = ?';
        db.query(query, [id], callback);
    }
};

module.exports = HistoryModel;