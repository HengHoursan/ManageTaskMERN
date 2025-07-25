const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);
// Get all users route
router.get('/users', authController.getAllUsers);
// Get user by ID route
router.get('/users/:id', authController.getUserById);

// Export the router
module.exports = router;