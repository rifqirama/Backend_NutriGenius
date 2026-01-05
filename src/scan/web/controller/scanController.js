exports.processScan = async (req, res) => {
  try {
    // 1. Validasi: Cek apakah Multer berhasil menangkap file
    if (!req.file) {
      console.error("❌ Waduh Mastah, filenya kosong! Check field name di Flutter (harus 'image').");
      return res.status(400).json({ 
        status: "error", 
        message: "File tidak ditemukan. Pastikan Anda mengirimkan gambar dengan key 'image'." 
      });
    }

    const { userId } = req.body;
    
    // Pastikan userId ada, kalau tidak ada nanti database bisa error
    if (!userId) {
      return res.status(400).json({ status: "error", message: "userId diperlukan, Mastah!" });
    }

    const useCase = req.app.get('analyzeImageUseCase');
    
    // 2. Sekarang aman memanggil .buffer karena req.file sudah dipastikan ada
    const result = await useCase.execute(
      userId, 
      req.file.buffer, 
      req.file.mimetype
    );

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.error("MASTAH, ADA ERROR DI SINI:", error);
    res.status(500).json({ status: "error", message: error.message });
  } 
};