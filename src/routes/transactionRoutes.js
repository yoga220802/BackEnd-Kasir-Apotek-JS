const express = require('express');
const { verifyToken, authorizeRole} = require('../middlewares/authMiddleware');
const { createTransaction} = require('../controllers/transactionController/createTransactionController');
const { deleteAllTransactions } = require('../controllers/transactionController/deleteAllTransactionsController');
const router = express.Router();

router.post('/create', verifyToken, authorizeRole('CSR'), createTransaction);

// harus dihapus ketika deploy ke server produksi
router.delete('/delete-all', verifyToken, authorizeRole('ADM'), deleteAllTransactions);
module.exports = router;