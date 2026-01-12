const NotificationModel = require('./notificationModel');

exports.getNotifications = async (req, res) => {
    const email = req.query.email || req.body.email;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email required" });
    }

    try {
        const user = await NotificationModel.getUserData(email);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const notifications = [];
        const now = new Date();

        if (!user.weight_kg || !user.height_cm || user.weight_kg == 0 || user.height_cm == 0) {
            notifications.push({
                title: "Lengkapi Profil Anda 👤",
                body: "Data berat dan tinggi badan belum lengkap. Yuk update agar perhitungan kalori akurat!",
                category: "system",
                timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000)
            });
        }

        const todayJournal = await NotificationModel.getTodayJournal(user.id);
        const targetProtein = 60; 

        if (todayJournal && todayJournal.total_protein >= targetProtein) {
            notifications.push({
                title: "Target Protein Tercapai! 🥩",
                body: `Luar biasa! Asupan protein sebesar ${todayJournal.total_protein}g sudah memenuhi target harianmu.`,
                category: "motivation",
                timestamp: now
            });
        }

        const weeklyCount = await NotificationModel.getWeeklyJournalCount(user.id);
        
        if (weeklyCount >= 3) {
            notifications.push({
                title: "Laporan Mingguan Siap! 📊",
                body: "Analisis nutrisimu minggu ini sudah tersedia. Cek grafik asupan sekarang.",
                category: "system",
                timestamp: new Date(now.getTime() - 9 * 60 * 60 * 1000)
            });
        }

        const currentHour = now.getHours();

        if (currentHour >= 6 && currentHour < 10) {
            notifications.push({
                title: "Waktunya Sarapan Sehat! 🍳",
                body: "Jangan lewatkan sarapan. Sudah log makananmu?",
                category: "reminder",
                timestamp: now
            });
        } else if (currentHour >= 11 && currentHour < 14) {
            notifications.push({
                title: "Waktunya Makan Siang 🥗",
                body: "Pilih menu seimbang protein dan serat ya!",
                category: "reminder",
                timestamp: now
            });
        } else if (currentHour >= 17 && currentHour < 21) {
            notifications.push({
                title: "Persiapan Makan Malam 🍽️",
                body: "Hindari makan terlalu larut agar tidur lebih nyenyak.",
                category: "reminder",
                timestamp: now
            });
        }

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};