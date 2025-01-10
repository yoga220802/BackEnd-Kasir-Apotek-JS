const express = require('express');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getSalesReport, exportSalesReport } = require('../controllers/reports/getSalesReportController');
const { getStockReport, exportStockReport } = require('../controllers/reports/getStockReportController');
const router = express.Router();

router.get('/sales', verifyToken, authorizeRole('ADM'), getSalesReport);
router.get('/sales/export', verifyToken, authorizeRole('ADM'), exportSalesReport);
router.get('/stock', verifyToken, authorizeRole('ADM'), getStockReport);
router.get('/stock/export', exportStockReport);

module.exports = router;