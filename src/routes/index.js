const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working fine!' });
});

// Authentication routes
router.use('/auth', authRoutes);

// user manager routes
router.use('/user', userRoutes);

// Export the combined routes
module.exports = router;
