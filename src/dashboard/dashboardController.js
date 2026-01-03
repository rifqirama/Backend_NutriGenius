const DashboardModel = require('./dashboardModel');

exports.getDashboardData = (req, res) => {

    const email = req.query.email || req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    DashboardModel.getUserProfile(email, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const user = results[0];

        console.log("DATA ASLI DARI DB:", user);

        const dbName = user.full_name;

        const tdee = user.calculated_tdee || 2000;
        const caloriesConsumed = 0;

        const proteinTarget = Math.round((tdee * 0.15) / 4);
        const fatTarget = Math.round((tdee * 0.25) / 9);
        const carbsTarget = Math.round((tdee * 0.60) / 4);
        
        const responseData = {
            full_name: dbName,
            tdee: user.calculated_tdee,
            calories_consumed: caloriesConsumed,

            protein_target: proteinTarget,
            protein_consumed: 0,

            carbs_target: carbsTarget,
            carbs_consumed: 0,

            fat_target: fatTarget,
            fat_consumed: 0,
        };

        res.status(200).json({ 
            success: true, 
            data: responseData 
        });
    });
};