const DashboardService = require('../services/dashboardService');

class DashboardController {
  // Updates contest ranking information for a specific user
  static async updateContestRankingInfo(req, res) {
    try {
      const userId = req.params.id; // Extract user ID from route params
      const contestData = req.body; // Extract contest data from request body
      const result = await DashboardService.upsertContestRankingInfo(userId, contestData); // Call service method
      res.status(200).json(result); // Return success response
    } catch (error) {
      res.status(400).json({ error: error.message }); // Return error response
    }
  }

  // Updates total questions solved for a specific user
  static async updateTotalQuestions(req, res) {
    try {
      const userId = req.params.id; // Extract user ID from route params
      const questionsData = req.body; // Extract questions data from request body
      const result = await DashboardService.upsertTotalQuestions(userId, questionsData); // Call service method
      res.status(200).json(result); // Return success response
    } catch (error) {
      res.status(400).json({ error: error.message }); // Return error response
    }
  }

  // Fetches dashboard data for a specific user
  static async getDashboardData(req, res) {
    try {
      const userId = req.params.id; // Extract user ID from route params
      const result = await DashboardService.getDashboardData(userId); // Call service method
      res.status(200).json(result); // Return success response
    } catch (error) {
      res.status(400).json({ error: error.message }); // Return error response
    }
  }
}

module.exports = DashboardController;