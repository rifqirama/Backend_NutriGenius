const HistoryModel = require('./historyModel');

exports.getHistory = (req, res) => {
    const email = req.query.email;
    HistoryModel.getAllByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });
        res.status(200).json({ success: true, data: results });
    });
};

exports.addHistory = (req, res) => {
    const data = req.body;
    HistoryModel.create(data, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });
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