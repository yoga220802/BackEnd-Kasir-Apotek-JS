const express = require('express');
const { getUsers } = require('../controllers/usermanager/getUserController');
const { addUser } = require('../controllers/usermanager/addUserController');
const { deleteUser } = require('../controllers/usermanager/deleteUserController');
const { verifyToken, authorizeRole, preventSelfDeletion  } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /user
router.get('/', verifyToken, authorizeRole('ADM'), getUsers);
router.post('/add', verifyToken, authorizeRole('ADM'), addUser);
router.delete('/delete/:userid', verifyToken, authorizeRole('ADM'),preventSelfDeletion, deleteUser);
module.exports = router;
