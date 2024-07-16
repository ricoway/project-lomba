const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Menampilkan dashboard user
router.get('/dashboard', authMiddleware.verifyToken, userController.dashboard);

// Rute untuk registrasi peserta baru (untuk user mendaftar ke lomba)
router.post('/register-participant', authMiddleware.verifyToken, userController.registerParticipant);

module.exports = router;
