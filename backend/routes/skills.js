const express = require('express');
const router = express.Router();
const { getSkills, getMyScores, getHeatmapData, getDashboardStats, getClassPerformance, getAlerts } = require('../controllers/skillController');
const { auth, roleCheck } = require('../middleware/auth');

router.get('/skills', auth, getSkills);
router.get('/my-scores', auth, getMyScores);
router.get('/heatmap', auth, getHeatmapData);
router.get('/dashboard', auth, getDashboardStats);
router.get('/class-performance', auth, roleCheck('faculty', 'admin'), getClassPerformance);
router.get('/alerts', auth, getAlerts);

module.exports = router;
