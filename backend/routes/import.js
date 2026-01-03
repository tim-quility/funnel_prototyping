
const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');
const authMiddleware = require('../middleware/authMiddleware');

// Accepts: { leads: [], mapping: {}, agentId: string }
//router.post('/csv', authMiddleware, importController.processCSVUpload);
router.post('/csv', importController.processCSVUpload);

module.exports = router;
