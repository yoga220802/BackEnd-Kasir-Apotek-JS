const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const docsRoutes = require('./docsRoutes')

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working fine!' });
});

// docs routes
router.use('/', docsRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// user manager routes
router.use('/user', userRoutes);

// Export the combined routes
module.exports = router;
