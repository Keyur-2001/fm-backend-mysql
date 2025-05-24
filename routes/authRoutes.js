const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Initial admin signup (no authentication required)
router.post('/initial-admin-signup', AuthController.initialAdminSignup);

// Admin signup (requires admin authentication)
router.post('/admin-signup', authMiddleware, AuthController.adminSignup);

// Create person (requires admin authentication, non-admin roles)
router.post('/create-person', authMiddleware, AuthController.createPerson);

// Login
router.post('/login', AuthController.login);

// Forgot password (no authentication required)
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password (no authentication required)
router.post('/reset-password', AuthController.resetPassword);

// Verify token
router.get('/verify-token', AuthController.verifyToken);

module.exports = router;