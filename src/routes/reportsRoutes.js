const express = require('express');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getSalesReport, exportSalesReport } = require('../controllers/reports/getSalesReportController');
const { getStockReport, exportStockReport } = require('../controllers/reports/getStockReportController');
const router = express.Router();

router.get('/sales', verifyToken, getSalesReport);
router.get('/sales/export', verifyToken, exportSalesReport);
router.get('/stock', verifyToken, getStockReport);
router.get('/stock/export', verifyToken, authorizeRole('ADM', 'WRH'), exportStockReport);

module.exports = router;