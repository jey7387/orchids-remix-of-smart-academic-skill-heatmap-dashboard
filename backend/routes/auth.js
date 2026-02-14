const express = require('express');
const router = express.Router();
const { login, getProfile, getAllUsers, deleteUser } = require('../controllers/authController');
const { auth, roleCheck } = require('../middleware/auth');

router.post('/login', login);
router.get('/profile', auth, getProfile);
router.get('/users', auth, roleCheck('admin'), getAllUsers);
router.delete('/users/:id', auth, roleCheck('admin'), deleteUser);

module.exports = router;
