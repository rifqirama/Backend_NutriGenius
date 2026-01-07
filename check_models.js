const { GoogleGenerativeAI } = require("@google/generative-ai");

// 👇 TEMPEL API KEY DARI AI STUDIO DI SINI (JANGAN PAKAI process.env)
const apiKey = "AIzaSyCKHgPwOOxn0lAJtrkR1KFmruuNtCeczXM"; 

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  console.log("🔍 Memulai Debugging Mendalam...");
  console.log(`🔑 Menggunakan Key (3 huruf depan): ${apiKey.substring(0, 3)}...`);

  try {
    // Kita coba panggil list models langsung (bukan generateContent)
    // Ini cara paling ringan ngecek koneksi key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("👉 Mencoba kirim pesan 'Halo' ke Gemini...");
    const result = await model.generateContent("Halo, apakah kamu hidup?");
    const response = await result.response;
    
    console.log("✅ BERHASIL! Gemini Merespon:", response.text());

  } catch (error) {
    console.log("\n❌ TERJADI ERROR (DETAIL LENGKAP):");
    
    // Cek status error
    if (error.status) console.log(`👉 Status Code: ${error.status}`);
    if (error.statusText) console.log(`👉 Status Text: ${error.statusText}`);
    
    // Cek pesan error
    console.log(`👉 Error Message: ${error.message}`);
    
    // Cek detail respon dari Google (jika ada)
    if (error.errorDetails) {
        console.log("👉 Error Details:", JSON.stringify(error.errorDetails, null, 2));
    }
  }
}

listModels();