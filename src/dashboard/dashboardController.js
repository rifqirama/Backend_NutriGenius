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

        const tdee = user.calculated_tdee || 2000;
        const caloriesConsumed = 0;
        const remainingCalories = tdee - caloriesConsumed;
        // Hitung Progress Bar (0.0 sampai 1.0)
        let progress = 0;
        if (tdee > 0) {
            progress = caloriesConsumed / tdee;
        }
        // Hitung Makro Nutrisi (Estimasi Standard)
        // Protein 15%, Lemak 25%, Karbo 60%
        // Dibagi 4 (Protein/Karbo) atau 9 (Lemak) untuk dapat gram-nya
        const proteinTarget = Math.round((tdee * 0.15) / 4);
        const fatTarget = Math.round((tdee * 0.25) / 9);
        const carbsTarget = Math.round((tdee * 0.60) / 4);
        
        // Format respon agar rapi
        const responseData = {
            displayName: user.full_name,
            gender: user.gender,
            weight: user.weight_kg,
            height: user.height_cm,
            tdee: user.calculated_tdee,
            bmr: user.calculated_bmr,
        };

        res.status(200).json({ 
            success: true, 
            data: responseData 
        });
    });
};