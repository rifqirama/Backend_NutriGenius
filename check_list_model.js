// Import fetch bawaan Node.js (pastikan Node.js kamu versi 18+)
// Kalau error "fetch is not defined", kabari saya.

// 👇 TEMPEL API KEY KAMU DI SINI
const apiKey = "AIzaSyCKHgPwOOxn0lAJtrkR1KFmruuNtCeczXM"; 

async function getAvailableModels() {
  console.log("🔍 Sedang meminta daftar model ke Google...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ ERROR DARI GOOGLE:");
      console.error(JSON.stringify(data.error, null, 2));
    } else {
      console.log("✅ SUKSES! Berikut model yang BISA kamu pakai:");
      console.log("------------------------------------------------");
      
      // Filter hanya model yang support generateContent
      const list = data.models || [];
      const usableModels = list.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      
      usableModels.forEach(m => {
        console.log(`📦 NAMA MODEL: ${m.name.replace("models/", "")}`);
        console.log(`   Versi: ${m.version}`);
        console.log(`   Deskripsi: ${m.displayName}`);
        console.log("------------------------------------------------");
      });

      if (usableModels.length === 0) {
        console.log("⚠️ TIDAK ADA model yang tersedia. Akun ini mungkin belum aktif API-nya.");
      }
    }
  } catch (error) {
    console.error("❌ Gagal Fetch:", error.message);
  }
}

getAvailableModels();