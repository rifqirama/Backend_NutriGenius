const ProfileModel = require('./profileModel');

exports.getUserProfile = (req, res) => {
    const email = req.query.email || req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email wajib dikirim' });
    }

    ProfileModel.getUserData(email, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB Error', error: err });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        const user = results[0];

        const activityMap = {
            1: "Tidak Aktif (Sedentary)",
            2: "Sedikit Aktif (1-3x/minggu)",
            3: "Cukup Aktif (3-5x/minggu)",
            4: "Sangat Aktif (6-7x/minggu)",
            5: "Ekstra Aktif (Fisik Berat)"
        };

        const healthMap = {
            1: "Sehat / Normal",
            2: "Diabetes",
            3: "Obesitas"
        };

        let age = 0;
        if (user.birth_date) {
            const birth = new Date(user.birth_date);
            const now = new Date();
            age = now.getFullYear() - birth.getFullYear();
        }

        let bmi = 0;
        if (user.height_cm > 0 && user.weight_kg > 0) {
            const heightM = user.height_cm / 100;
            bmi = (user.weight_kg / (heightM * heightM)).toFixed(1);
        }

        const responseData = {
            full_name: user.full_name,
            email: user.email,
            gender: user.gender,
            age: age,
            weight: user.weight_kg,
            height: user.height_cm,
            bmi: bmi,
            activity_label: activityMap[user.activity_id] || "Tidak diketahui",
            health_label: healthMap[user.health_id] || "Tidak diketahui",
            joined_at: user.created_at
        };

        res.status(200).json({ success: true, data: responseData });
    });
};