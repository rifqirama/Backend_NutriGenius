const AnalyzeImageUseCase = require('../../domain/usecases/analyzeImageUseCase');
const ScanRepositoryImpl = require('../../data/repositories/scanRepositoryImpl');
const GeminiService = require('../../data/services/geminiService');
const AuthModel = require('../../../auth/authModel');

const ScanHistory = require('../../data/models/scanHistory');

const geminiService = new GeminiService();
const scanRepository = new ScanRepositoryImpl();
const useCase = new AnalyzeImageUseCase(scanRepository, geminiService);

exports.processScan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File gambar tidak ditemukan. Pastikan key-nya 'image'."
      });
    }

    console.log("📂 File Details:", {
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
    
    const { email } = req.body;
    console.log(`🔍 Processing Preview for: ${email}`);

    const user = await new Promise((resolve, reject) => {
        AuthModel.findByEmail(email, (err, results) => {
            if (err) {
                reject(err);
            } else if (!results || results.length === 0) {
                resolve(null);
            } else {
                resolve(results[0]);
            }
        });
    });
    
    if (!user) {
       return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    console.log("👤 User Profile Found:", {
        condition: user.health_condition,
        tdee: user.tdee
    });

    const result = await useCase.executeAnalysisOnly(
      email,
      req.file.path,
      req.file.filename,
      req.file.mimetype,
      user
    );

    res.status(200).json({
      success: true,
      message: "Analisis selesai (Preview Mode)",
      data: result
    });

  } catch (error) {
    console.error("❌ ERROR PREVIEW:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan internal server"
    });
  }
};

exports.saveScanResult = async (req, res) => {
  try {
    console.log("💾 Menyimpan data ke database...");
    
    const { 
      email, 
      food_name, 
      calories, 
      protein, 
      carbs, 
      fat, 
      sugar, 
      ai_suggestion, 
      image_path 
    } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const savedData = await scanRepository.save({
      userId: user.id,
      foodName: food_name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      sugar: parseFloat(sugar),
      aiSuggestion: ai_suggestion,
      imagePath: image_path
    });

    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan ke Jurnal!",
      data: savedData
    });

  } catch (error) {
    console.error("❌ ERROR SAVE:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal menyimpan data"
    });
  }
};