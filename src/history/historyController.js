const HistoryModel = require('./historyModel');

exports.getHistory = (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: "Email diperlukan untuk mengambil riwayat." 
        });
    }

    HistoryModel.getAllByEmail(email, (err, results) => {
        if (err) {
            console.error("❌ Error Get History:", err);
            return res.status(500).json({ success: false, error: "Gagal mengambil data database." });
        }
        
        if (results.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "Belum ada riwayat." });
        }

        res.status(200).json({ success: true, data: results });
    });
};

exports.addHistory = (req, res) => {
    const data = req.body;
    
    if (!data.email || !data.food_name) {
         return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    HistoryModel.create(data, (err, result) => {
        if (err) {
            console.error("❌ Error Add History:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.status(201).json({ success: true, message: "Riwayat tersimpan!" });
    });
};

exports.deleteHistory = (req, res) => {
    const id = req.params.id;
    HistoryModel.delete(id, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });
        res.status(200).json({ success: true, message: "Riwayat dihapus!" });
    });
};