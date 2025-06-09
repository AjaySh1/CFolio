const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware')


// Contest Ranking Info Routes
router.post('/:id/contest-ranking', DashboardController.updateContestRankingInfo);
router.post('/:id/total-questions', DashboardController.updateTotalQuestions);
router.get('/:id', DashboardController.getDashboardData);

module.exports = router;