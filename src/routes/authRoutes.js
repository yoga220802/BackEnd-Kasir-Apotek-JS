const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// Define routes
router.post('/login', login);

module.exports = router;
