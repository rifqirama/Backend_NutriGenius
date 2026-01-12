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
        model: "gemini-2.5-flash-lite", 
        generationConfig: { responseMimeType: "application/json" } 
      });

      const imageBuffer = fs.readFileSync(imagePath);
      
      const tdee = userProfile.calculated_tdee || userProfile.tdee || 0;
      
      const condition = userProfile.health_condition || 'Normal';

      console.log(`🤖 Konteks User -> TDEE: ${tdee}, Kondisi: ${condition}`);

      const prompt = `
        Tugas: Kamu adalah Ahli Gizi AI (NutriGenius).
        Analisis gambar makanan ini dan ekstrak data nutrisinya.
        
        Konteks Pengguna:
        - Kondisi Kesehatan: ${condition}
        - Target Kalori Harian (TDEE): ${tdee} kkal
        
        Instruksi Output:
        1. Identifikasi nama makanan (food_name) dalam Bahasa Indonesia.
        2. Perkirakan kalori, protein, karbo, lemak, dan gula.
        3. Berikan saran singkat (ai_suggestion) maks 2 kalimat. Sesuaikan saran dengan TDEE pengguna (${tdee} kkal). Apakah makanan ini aman untuk porsi harian mereka?
        
        Format JSON (Wajib):
        {
          "foodName": "Nama Makanan",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "sugar": 0,
          "aiSuggestion": "Saran singkat..."
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
      
      // Jangan hapus file dulu saat debugging biar bisa dicek
      // if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); 
      
      throw new Error("Gagal analisis AI. Pastikan koneksi internet lancar.");
    }
  }
}

module.exports = GeminiService;