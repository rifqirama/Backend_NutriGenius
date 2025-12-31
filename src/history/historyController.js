const db = require('../config/database');
exports.getWeeklyStats = (req, res) => {
    const userId = req.params.user_id;
    
    const query = `
        SELECT 
            DAYNAME(created_at) as hari, 
            SUM(calories) as total_kalori 
        FROM journal_details 
        WHERE user_id = ? 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY created_at ASC`;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const chartData = results.map(row => row.total_kalori);
        res.json(chartData);
    });
};

exports.deleteHistory = (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM journal_details WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }
        
        res.json({ message: "Riwayat berhasil dihapus dari server" });
    });
};