class SaveScanUseCase {
  constructor(scanRepository) {
    this.scanRepository = scanRepository;
  }

  async executeSaveScan(userId, analysisResult, imagePath) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!analysisResult) {
        throw new Error("Analysis result is required");
      }

      // Prepare data for saving
      const scanData = {
        userId: userId,
        foodName: analysisResult.food_name || "Makanan Tidak Teridentifikasi",
        calories: parseFloat(analysisResult.calories) || 0,
        protein: parseFloat(analysisResult.protein) || 0,
        carbs: parseFloat(analysisResult.carbs) || 0,
        fat: parseFloat(analysisResult.fat) || 0,
        sugar: parseFloat(analysisResult.sugar) || 0,
        aiSuggestion: analysisResult.ai_suggestion || "",
        imagePath: imagePath || ""
      };

      const savedScan = await this.scanRepository.saveScanToJournal(userId, scanData);

      if (!savedScan) {
        throw new Error("Database returned empty response");
      }

      return {
        success: true,
        message: "Scan berhasil disimpan ke Jurnal!",
        data: savedScan
      };

    } catch (error) {
      console.error("❌ SaveScanUseCase Error:", error);
      throw new Error(`Gagal menyimpan scan: ${error.message}`);
    }
  }
}

module.exports = SaveScanUseCase;