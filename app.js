// file: app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Import Routes
const authRoutes = require('./src/auth/authRoutes');
const firstpageRoutes = require('./src/firstpage/firstpageRoutes');
const dashboardRoutes = require('./src/dashboard/dashboardRoutes');
const historyRoutes = require('./src/history/historyRoutes');
const profileRoutes = require('./src/profile/profileRoutes');
const scanRoutes = require('./src/scan/web/controller/scanRoutes'); // Rute baru untuk Scan

// Import Clean Architecture Components untuk Scan
const ScanRepositoryImpl = require('./src/scan/data/repositories/scanRepositoryImpl');
const GeminiService = require('./src/scan/data/services/geminiService');
const AnalyzeImageUseCase = require('./src/scan/domain/usecases/analyzeImageUseCase');

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Dependency Injection sederhana
const scanRepo = new ScanRepositoryImpl();
const aiService = new GeminiService();
const analyzeImageUseCase = new AnalyzeImageUseCase(scanRepo, aiService);

// Simpan UseCase di app.set agar bisa diakses oleh controller
app.set('analyzeImageUseCase', analyzeImageUseCase);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/firstpage', firstpageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/scan', scanRoutes); // Endpoint: /api/scan/analyze

// Test Route
app.get('/', (req, res) => {
    res.send('NutriGenius Backend is Running...');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});