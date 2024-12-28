const express = require('express');
const { getMedicines, getMedicineById } = require('../controllers/medicineManager/getMedicineController');
const { getMedicineBatches, getMedicineBatchById } = require('../controllers/medicineManager/getMedicineBatchController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /medicine
router.get('/', verifyToken, authorizeRole('WRH'), getMedicines);
router.get('/batch', verifyToken, authorizeRole('WRH'), getMedicineBatches);
router.get('/batch/:batchid', verifyToken, authorizeRole('WRH'), getMedicineBatchById);
router.get('/:medicineid', verifyToken, authorizeRole('WRH'), getMedicineById);

module.exports = router;
