const GetDashboardDataUseCase = require('./domain/usecases/getDashboardDataUseCase');
const DashboardRepositoryImpl = require('./data/repositories/dashboardRepositoryImpl');

const dashboardRepository = new DashboardRepositoryImpl();
const getDashboardDataUseCase = new GetDashboardDataUseCase(dashboardRepository);

exports.getDashboardData = async (req, res) => {
  try {
    const email = req.query.email || req.body.email;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const result = await getDashboardDataUseCase.executeGetDashboardData(email);

    res.status(200).json(result);

  } catch (error) {
    console.error("❌ Dashboard Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Gagal memuat data dashboard' 
    });
  }
};