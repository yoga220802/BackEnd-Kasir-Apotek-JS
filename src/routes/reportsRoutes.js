const express = require('express');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getSalesReport, exportSalesReport } = require('../controllers/reports/getSalesReportController');
const { getStockReport, exportStockReport } = require('../controllers/reports/getStockReportController');
const router = express.Router();

router.get('/sales', verifyToken, authorizeRole('ADM', 'CSR'), getSalesReport);
router.get('/sales/export', verifyToken, authorizeRole('ADM', 'CSR'), exportSalesReport);
router.get('/stock', verifyToken, authorizeRole('ADM', 'WRH'),getStockReport);
router.get('/stock/export', verifyToken, authorizeRole('ADM', 'WRH'), exportStockReport);

module.exports = router;