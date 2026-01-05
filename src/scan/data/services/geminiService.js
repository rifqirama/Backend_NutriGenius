const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    // Mengambil API Key dari .env yang baru saja kamu isi
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di file .env");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeFood(imageBuffer, mimeType, userProfile) {
    try {
      // Inisialisasi model (gunakan flash agar cepat dan murah)
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Menyusun prompt berdasarkan data dari database db_nutrigenius
      const prompt = `
        Tugas: Analisis nutrisi makanan dari gambar.
        Konteks Pengguna:
        - Kondisi Kesehatan: ${userProfile.health_condition || 'Normal'}
        - Batas Gula Harian: ${userProfile.sugar_limit || 50}g
        - Target Kalori (TDEE): ${userProfile.tdee || 2000} kkal

        Instruksi Khusus:
        Beri saran (ai_suggestion) yang spesifik untuk kondisi ${userProfile.health_condition}. 
        Jika makanan tinggi gula dan user diabetes, beri peringatan keras.

        Format Output harus JSON murni:
        {
          "food_name": "string",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "sugar": number,
          "ai_suggestion": "string"
        }
      `;

      // Konversi buffer gambar ke format yang diminta Gemini
      const imageParts = [
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: mimeType,
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      let text = response.text();

      // Membersihkan karakter markdown (```json ... ```) jika ada
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      // Parsing string ke JSON objek
      const nutritionData = JSON.parse(text);
      
      return nutritionData;
    } catch (error) {
      console.error("Gemini Service Error:", error);
      throw new Error("Gagal menganalisis gambar dengan AI: " + error.message);
    }
  }
}

module.exports = GeminiService;