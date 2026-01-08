const NotificationModel = require('./notificationModel');

exports.getNotifications = (req, res) => {
    // Tangkap email dari Body (POST) atau Query (GET)
    const email = req.body.email || req.query.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    NotificationModel.getByEmail(email, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        res.status(200).json({
            success: true,
            data: results
        });
    });
};