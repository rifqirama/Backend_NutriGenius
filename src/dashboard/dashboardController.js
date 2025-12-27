const DashboardModel = require('./dashboardModel');

exports.getDashboardData = (req, res) => {
    // Email bisa dikirim lewat Body atau Query Params
    const email = req.query.email || req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    DashboardModel.getUserProfile(email, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = results[0];

        // Format respon agar rapi
        const responseData = {
            displayName: user.name,
            gender: user.gender,
            weight: user.weight_kg,
            height: user.height_cm,
            tdee: user.calculated_tdee,
            bmr: user.calculated_bmr,
            // Kita bisa tambah logika lain di sini nanti
        };

        res.status(200).json({ 
            success: true, 
            data: responseData 
        });
    });
};