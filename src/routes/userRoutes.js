const express = require('express');
const { getUsers } = require('../controllers/usermanager/getUserController');
const { addUser } = require('../controllers/usermanager/addUserController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /user
router.get('/', verifyToken, authorizeRole('ADM'), getUsers);
router.post('/add', verifyToken, authorizeRole('ADM'), addUser);

module.exports = router;
