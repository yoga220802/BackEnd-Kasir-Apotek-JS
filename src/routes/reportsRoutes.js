const express = require('express');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getSalesReport, exportSalesReport } = require('../controllers/reports/getSalesReportController');
const router = express.Router();

router.get('/sales', verifyToken, authorizeRole('ADM'), getSalesReport);
router.get('/sales/export', verifyToken, authorizeRole('ADM'), exportSalesReport);
module.exports = router;