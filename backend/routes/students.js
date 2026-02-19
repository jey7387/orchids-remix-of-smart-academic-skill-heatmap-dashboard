const express = require('express');
const router = express.Router();
const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent, 
  addStudentScores, 
  getStudentScores 
} = require('../controllers/studentController');
const { auth, roleCheck } = require('../middleware/auth');

// Create new student (faculty/admin only)
router.post('/', auth, roleCheck('faculty', 'admin'), createStudent);

// Get all students (faculty/admin only)
router.get('/', auth, roleCheck('faculty', 'admin'), getAllStudents);

// Get student by ID (faculty/admin only)
router.get('/:id', auth, roleCheck('faculty', 'admin'), getStudentById);

// Get student edit page (faculty/admin only)
router.get('/edit/:id', auth, roleCheck('faculty', 'admin'), getStudentById);

// Update student (faculty/admin only)
router.put('/:id', auth, roleCheck('faculty', 'admin'), updateStudent);

// Delete student (admin only)
router.delete('/:id', auth, roleCheck('admin'), deleteStudent);

// Add skill scores for student (faculty only)
router.post('/:id/scores', auth, roleCheck('faculty', 'admin'), addStudentScores);

// Get student's skill scores (faculty/admin only)
router.get('/:id/scores', auth, roleCheck('faculty', 'admin'), getStudentScores);

module.exports = router;
