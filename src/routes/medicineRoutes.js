const express = require('express');
const { getMedicines, getMedicineById } = require('../controllers/medicineManager/getMedicineController');
const { getMedicineBatches, getMedicineBatchById } = require('../controllers/medicineManager/getMedicineBatchController');
const { getMedicineCategories, getMedicinesByCategoryId } = require('../controllers/medicineManager/getMedicineCategoriesController');
const { restockMedicine } = require('../controllers/medicineManager/addMedicineBatchController');
const { addMedicine } = require('../controllers/medicineManager/addMedicineController');
const { addCategory } = require('../controllers/medicineManager/addCategoryController');
const { updateMedicine } = require('../controllers/medicineManager/editMedicineController');
const { updateMedicineBatch } = require('../controllers/medicineManager/editMedicineBatchController');
const { updateCategoryDescription } = require('../controllers/medicineManager/editCategoryController');
const { resetMedicineStock, resetBatchAmount } = require('../controllers/medicineManager/resetMedicineStockController');

const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', verifyToken, authorizeRole('WRH', 'ADM'), getMedicines);
router.get('/batch', verifyToken, authorizeRole('WRH', 'ADM'), getMedicineBatches);
router.get('/category', verifyToken, authorizeRole('WRH', 'ADM'), getMedicineCategories);

router.post('/add', verifyToken, authorizeRole('WRH', 'ADM'), addMedicine);
router.post('/restock', verifyToken, authorizeRole('WRH', 'ADM'), restockMedicine);
router.post('/category/add', verifyToken, authorizeRole('WRH', 'ADM'), addCategory);

router.get('/category/:categoryid', verifyToken, authorizeRole('WRH', 'ADM'), getMedicinesByCategoryId);
router.get('/batch/:batchid', verifyToken, authorizeRole('WRH', 'ADM'), getMedicineBatchById);
router.get('/:medicineid', verifyToken, authorizeRole('WRH', 'ADM'), getMedicineById);

router.patch('/reset-stock/:medicineid', verifyToken, authorizeRole('WRH', 'ADM'), resetMedicineStock);
router.patch('/reset-batch/:batchid/:medicineid', verifyToken, authorizeRole('WRH', 'ADM'), resetBatchAmount);
router.patch('/:medicineid', verifyToken, authorizeRole('WRH', 'ADM'), updateMedicine);
router.patch('/batch/:batchid', verifyToken, authorizeRole('WRH', 'ADM'), updateMedicineBatch);
router.patch('/category/:categoryid', verifyToken, authorizeRole('WRH', 'ADM'), updateCategoryDescription);
module.exports = router;
