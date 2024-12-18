const express = require('express');
const { getUsers } = require('../controllers/usermanager/getUserController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /user
router.get('/', verifyToken, authorizeRole('ADM'), getUsers);

module.exports = router;
