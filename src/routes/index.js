const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openAPI.json');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const medicineRoutes = require('./medicineRoutes');
const transactionRoutes = require('./transactionRoutes');
const reportsRoutes = require('./reportsRoutes');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../landing/index.html'));
});

// docs routes
// router.use('/', docsRoutes);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication routes
router.use('/auth', authRoutes);

// user manager routes
router.use('/user', userRoutes);

// medicine manager routes
router.use('/medicine', medicineRoutes);

// transaction manager routes
router.use('/transaction', transactionRoutes);

// report routes
router.use('/report', reportsRoutes);

// Export the combined routes
module.exports = router;
