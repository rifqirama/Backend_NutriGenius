const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./src/auth/authRoutes');
const firstpageRoutes = require('./src/firstpage/firstpageRoutes');
const dashboardRoutes = require('./src/dashboard/dashboardRoutes');
const historyRoutes = require('./src/history/historyRoutes');
const profileRoutes = require('./src/profile/profileRoutes');
const scanRoutes = require('./src/scan/web/controller/scanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/scan', scanRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('NutriGenius Backend is Running...');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});