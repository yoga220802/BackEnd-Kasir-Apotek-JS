const express = require('express');
const { getMedicines, getMedicineById } = require('../controllers/medicineManager/getMedicineController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /medicine
router.get('/', verifyToken, authorizeRole('WRH'), getMedicines);
router.get('/:medicineid', verifyToken, authorizeRole('WRH'), getMedicineById);

module.exports = router;
