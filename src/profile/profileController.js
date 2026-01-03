const ProfileModel = require('./profileModel');

exports.updateProfile = (req, res) => {
    const { email, full_name, weight_kg, height_cm, gender, birth_date } = req.body;

    const data = { 
        email, 
        name: full_name,
        weight: weight_kg, 
        height: height_cm, 
        gender, 
        birth_date 
    };

    ProfileModel.updateProfile(data, (err, result) => {
        if (err) {
            console.error("Error MySQL:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, message: "Data tersimpan di MySQL!" });
    });
};