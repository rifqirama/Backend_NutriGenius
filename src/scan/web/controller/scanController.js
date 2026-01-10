const AnalyzeImageUseCase = require('../../domain/usecases/analyzeImageUseCase');
const SaveScanUseCase = require('../../domain/usecases/saveScanUseCase');
const ScanRepositoryImpl = require('../../data/repositories/scanRepositoryImpl');
const GeminiService = require('../../data/services/geminiService');
const AuthModel = require('../../../auth/authModel');


const geminiService = new GeminiService();
const scanRepository = new ScanRepositoryImpl();
const analyzeUseCase = new AnalyzeImageUseCase(scanRepository, geminiService);
const saveScanUseCase = new SaveScanUseCase(scanRepository);

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
    console.log(`🔍 Mencari di Database User dengan email: '${email}'`);

    const user = await new Promise((resolve, reject) => {
        AuthModel.findByEmail(email, (err, results) => {
            if (err) {
                console.error("💥 SQL Error:", err);
                reject(err);
            } else {
                console.log("📂 Hasil Query DB:", results); 
                
                if (!results || results.length === 0) {
                    resolve(null); 
                } else {
                    resolve(results[0]); 
                }
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

    const result = await analyzeUseCase.executeAnalysisOnly(
      email,
      req.file.path,
      req.file.filename,
      req.file.mimetype,
      user
    );

    const responseData = {
        ...result,   
        image_path: req.file.filename
    };

    console.log("📤 Mengirim Data ke Flutter:", responseData);

    res.status(200).json({
      success: true,
      message: "Analisis selesai (Preview Mode)",
      data: responseData
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

    // Get user from database
    const user = await new Promise((resolve, reject) => {
      AuthModel.findByEmail(email, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results && results.length > 0 ? results[0] : null);
        }
      });
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // Prepare analysis result
    const analysisResult = {
      food_name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      sugar: parseFloat(sugar),
      ai_suggestion
    };

    // Use the SaveScanUseCase
    const savedData = await saveScanUseCase.executeSaveScan(
      user.id,
      analysisResult,
      image_path
    );

    res.status(201).json(savedData);

  } catch (error) {
    console.error("❌ ERROR SAVE:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal menyimpan data"
    });
  }
};