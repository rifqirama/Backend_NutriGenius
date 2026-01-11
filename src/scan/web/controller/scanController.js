const AnalyzeImageUseCase = require('../../domain/usecases/analyzeImageUseCase');
const GetHistoryUseCase = require('../../domain/usecases/getHistoryUseCase');
const SaveScanUseCase = require('../../domain/usecases/saveScanUseCase')
const ScanRepositoryImpl = require('../../data/repositories/scanRepositoryImpl');
const GeminiService = require('../../data/services/geminiService');
const AuthModel = require('../../../auth/authModel');
const { request } = require('express');

const geminiService = new GeminiService();
const scanRepository = new ScanRepositoryImpl();
const useCase = new AnalyzeImageUseCase(scanRepository, geminiService);
const saveScanUseCase = new SaveScanUseCase(scanRepository);
const getHistoryUseCase = new GetHistoryUseCase(scanRepository);

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

    const result = await useCase.executeAnalysisOnly(
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

    console.log("📦 Body Request:", req.body);
    console.log("🥦 Analysis Data:", { food_name, calories, protein });

    const analysisResult = {
      food_name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      sugar: parseFloat(sugar),
      ai_suggestion
    };

    const savedData = await saveScanUseCase.executeSaveScan(
      user.id,
      analysisResult,
      image_path
    );

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

exports.getHistory = async (req, res) => {
  try {
    const { email, meal_type_id } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email diperlukan" });
    }

    const user = await new Promise((resolve, reject) => {
      AuthModel.findByEmail(email, (err, results) => {
        if (err) reject(err);
        else resolve(results && results.length > 0 ? results[0] : null);
      });
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const historyData = await getHistoryUseCase.execute(user.id, meal_type_id);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil riwayat",
      data: historyData
    });

  } catch (error) {
    console.error("❌ History Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat scan"
    });
  }
};