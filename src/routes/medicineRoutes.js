const express = require('express');
const { getMedicines, getMedicineById } = require('../controllers/medicineManager/getMedicineController');
const { getMedicineBatches, getMedicineBatchById } = require('../controllers/medicineManager/getMedicineBatchController');
const { getMedicineCategories, getMedicinesByCategoryId } = require('../controllers/medicineManager/getMedicineCategoriesController');
const { restockMedicine } = require('../controllers/medicineManager/addMedicineBatchController');
const { addMedicine } = require('../controllers/medicineManager/addMedicineController');
const { addCategory } = require('../controllers/medicineManager/addCategoryController');

const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', verifyToken, authorizeRole('WRH'), getMedicines);
router.get('/batch', verifyToken, authorizeRole('WRH'), getMedicineBatches);
router.get('/category', verifyToken, authorizeRole('WRH'), getMedicineCategories);

router.post('/add', verifyToken, authorizeRole('WRH'), addMedicine);
router.post('/restock', verifyToken, authorizeRole('WRH'), restockMedicine);
router.post('/category/add', verifyToken, authorizeRole('WRH'), addCategory);

router.get('/category/:categoryid', verifyToken, authorizeRole('WRH'), getMedicinesByCategoryId);
router.get('/batch/:batchid', verifyToken, authorizeRole('WRH'), getMedicineBatchById);
router.get('/:medicineid', verifyToken, authorizeRole('WRH'), getMedicineById);



module.exports = router;
