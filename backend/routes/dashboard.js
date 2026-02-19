const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');

// Student dashboard
router.get('/student', auth, roleCheck('student'), (req, res) => {
  res.json({
    message: 'Welcome to Student Dashboard',
    user: req.userDetails,
    features: [
      'View your skill heatmap',
      'Update your skill scores',
      'Track your progress',
      'View faculty feedback'
    ]
  });
});

// Faculty dashboard
router.get('/faculty', auth, roleCheck('faculty'), async (req, res) => {
  try {
    const pool = require('../config/db');
    
    // Get all students for faculty to manage
    const students = await pool.query(
      'SELECT id, name, email FROM users WHERE role = $1 ORDER BY name',
      ['student']
    );
    
    res.json({
      message: 'Welcome to Faculty Dashboard',
      user: req.userDetails,
      features: [
        'View all student progress',
        'Update student skill scores',
        'Generate reports',
        'Manage class performance'
      ],
      students: students.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin dashboard
router.get('/admin', auth, roleCheck('admin'), async (req, res) => {
  try {
    const pool = require('../config/db');
    
    // Get system statistics
    const stats = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users 
      GROUP BY role
    `);
    
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalSkills = await pool.query('SELECT COUNT(DISTINCT skill_name) as count FROM skill_scores');
    
    res.json({
      message: 'Welcome to Admin Dashboard',
      user: req.userDetails,
      features: [
        'Manage all users',
        'System configuration',
        'Generate comprehensive reports',
        'Manage skill categories',
        'System analytics'
      ],
      statistics: {
        totalUsers: totalUsers.rows[0].count,
        totalSkills: totalSkills.rows[0].count,
        usersByRole: stats.rows
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
