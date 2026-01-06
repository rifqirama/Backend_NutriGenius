const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di file .env");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeImage(imagePath, mimeType, userProfile = {}) {
    try {
      
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
      });

      const imageBuffer = fs.readFileSync(imagePath);
      
      const prompt = `
        Tugas: Kamu adalah Ahli Gizi AI (NutriGenius).
        Analisis gambar makanan ini dan ekstrak data nutrisinya.
        
        Konteks Pengguna:
        - Kondisi: ${userProfile.health_condition || 'Normal'}
        - Target Kalori: ${userProfile.tdee || 2000} kkal
        
        Instruksi Output:
        1. Identifikasi nama makanan.
        2. Perkirakan kalori, protein, karbo, lemak, dan gula.
        3. Berikan saran singkat (ai_suggestion). Jika pengguna Diabetes dan makanan manis, beri peringatan.
        
        Format JSON (Wajib):
        {
          "food_name": "Nama Makanan",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "sugar": 0,
          "ai_suggestion": "Saran singkat..."
        }
      `;

      const imageParts = [
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: mimeType,
          },
        },
      ];

      console.log("🤖 Mengirim ke Gemini AI...");
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      
      const text = response.text().trim();
      
      console.log("✅ Respon Gemini:", text);
      
      return JSON.parse(text);

    } catch (error) {
      console.error("❌ Gemini Service Error:", error);

      throw new Error("Gagal analisis AI. Coba foto ulang dengan pencahayaan lebih baik.");
    }
  }
}

module.exports = GeminiService;