class AnalyzeImageUseCase {
  constructor(scanRepository, geminiService) {
    this.scanRepository = scanRepository;
    this.geminiService = geminiService;
  }

  async executeAnalysisOnly(email, filePath, filename, mimeType, userProfile) {
    
    const analysisResult = await this.geminiService.analyzeImage(filePath, mimeType, userProfile);
    
    return {
      food_name: analysisResult.foodName,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      sugar: analysisResult.sugar,
      ai_suggestion: analysisResult.aiSuggestion,
      image_path: filename, 
    };
  }
}

module.exports = AnalyzeImageUseCase;