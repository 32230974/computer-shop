const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.get('/users', authenticateToken, authController.getAllUsers);
router.post('/users/admin', authenticateToken, authController.createAdmin);
router.delete('/users/:id', authenticateToken, authController.deleteUser);
router.get('/stats', authenticateToken, authController.getAdminStats);

// Address routes
router.get('/addresses', authenticateToken, authController.getAddresses);
router.post('/addresses', authenticateToken, authController.addAddress);
router.put('/addresses/:id', authenticateToken, authController.updateAddress);
router.delete('/addresses/:id', authenticateToken, authController.deleteAddress);
router.put('/addresses/:id/default', authenticateToken, authController.setDefaultAddress);

module.exports = router;
