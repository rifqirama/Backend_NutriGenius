class GetDashboardDataUseCase {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async executeGetDashboardData(email) {
    try {
      // Validate input
      if (!email) {
        throw new Error("Email is required");
      }

      // Get user profile
      const user = await this.dashboardRepository.getUserProfile(email);

      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      // Get today's daily journal record
      const dailyJournal = await this.dashboardRepository.getUserDailyJournal(user.id);

      // Get today's scan details for count
      const todayScans = await this.dashboardRepository.getUserTodayScanHistory(user.id);

      // Use journal totals if available, otherwise calculate from scans
      const caloriesConsumed = dailyJournal ? dailyJournal.total_calories : todayScans.reduce((sum, scan) => sum + (scan.calories || 0), 0);
      const proteinConsumed = dailyJournal ? dailyJournal.total_protein : todayScans.reduce((sum, scan) => sum + (scan.protein || 0), 0);
      const carbsConsumed = dailyJournal ? dailyJournal.total_carbs : todayScans.reduce((sum, scan) => sum + (scan.carbs || 0), 0);
      const fatConsumed = dailyJournal ? dailyJournal.total_fat : todayScans.reduce((sum, scan) => sum + (scan.fat || 0), 0);
      const sugarConsumed = todayScans.reduce((sum, scan) => sum + (scan.sugar || 0), 0);

      // Get TDEE from user profile
      const tdee = user.calculated_tdee || 0;

      // Calculate macronutrient targets (using standard percentages)
      // Protein: 15% of TDEE (4 calories per gram)
      // Fat: 25% of TDEE (9 calories per gram)
      // Carbs: 60% of TDEE (4 calories per gram)
      const proteinTarget = Math.round((tdee * 0.15) / 4);
      const fatTarget = Math.round((tdee * 0.25) / 9);
      const carbsTarget = Math.round((tdee * 0.60) / 4);

      // Calculate remaining calories and macros
      const caloriesRemaining = Math.max(0, tdee - caloriesConsumed);
      const proteinRemaining = Math.max(0, proteinTarget - proteinConsumed);
      const carbsRemaining = Math.max(0, carbsTarget - carbsConsumed);
      const fatRemaining = Math.max(0, fatTarget - fatConsumed);

      // Calculate percentages
      const caloriesPercentage = tdee > 0 ? Math.round((caloriesConsumed / tdee) * 100) : 0;
      const proteinPercentage = proteinTarget > 0 ? Math.round((proteinConsumed / proteinTarget) * 100) : 0;
      const carbsPercentage = carbsTarget > 0 ? Math.round((carbsConsumed / carbsTarget) * 100) : 0;
      const fatPercentage = fatTarget > 0 ? Math.round((fatConsumed / fatTarget) * 100) : 0;

      return {
        success: true,
        data: {
          user_info: {
            full_name: user.full_name,
            email: user.email,
            health_condition: user.health_condition || "Normal"
          },
          daily_summary: {
            tdee: tdee,
            calories_consumed: Math.round(caloriesConsumed),
            calories_remaining: Math.round(caloriesRemaining),
            calories_percentage: caloriesPercentage,
            scan_count_today: todayScans.length
          },
          macronutrients: {
            protein: {
              target: proteinTarget,
              consumed: Math.round(proteinConsumed),
              remaining: Math.round(proteinRemaining),
              percentage: proteinPercentage
            },
            carbs: {
              target: carbsTarget,
              consumed: Math.round(carbsConsumed),
              remaining: Math.round(carbsRemaining),
              percentage: carbsPercentage
            },
            fat: {
              target: fatTarget,
              consumed: Math.round(fatConsumed),
              remaining: Math.round(fatRemaining),
              percentage: fatPercentage
            }
          },
          other_nutrients: {
            sugar_consumed: Math.round(sugarConsumed)
          },
          recent_scans: todayScans.slice(0, 5)
        }
      };

    } catch (error) {
      console.error("❌ GetDashboardDataUseCase Error:", error);
      throw new Error(`Gagal memuat data dashboard: ${error.message}`);
    }
  }
}

module.exports = GetDashboardDataUseCase;