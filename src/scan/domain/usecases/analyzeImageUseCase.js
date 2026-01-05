class AnalyzeImageUseCase {
  constructor(scanRepo, aiService) {
    this.scanRepo = scanRepo;
    this.aiService = aiService;
  }

  async execute(userId, imageBuffer, mimeType) {
    // 1. Ambil konteks kesehatan dari MySQL via Repo
    const userProfile = await this.scanRepo.getUserProfileForAi(userId);

    // 2. Analisis gambar menggunakan AI dengan konteks profil user
    const nutritionData = await this.aiService.analyzeFood(imageBuffer, mimeType, userProfile);

    // 3. Simpan hasil ke database (daily_journals & journal_details)
    const savedResult = await this.scanRepo.saveAnalysisResult(userId, nutritionData);

    return savedResult;
  }
}

module.exports = AnalyzeImageUseCase; // WAJIB ADA