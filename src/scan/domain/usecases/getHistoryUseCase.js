class GetHistoryUseCase {
  constructor(scanRepository) {
    this.scanRepository = scanRepository;
  }

  async execute(userId, mealTypeId) {
    return await this.scanRepository.getHistory(userId, mealTypeId);
  }
}

module.exports = GetHistoryUseCase;