const express = require('express');
const router = express.Router();
const path = require('path');

// Serve the documentation page
router.get('/docs', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../docs/docs.html'));
});

module.exports = router;
