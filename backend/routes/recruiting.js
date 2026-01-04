const express = require('express');
const router = express.Router();
const recruitingController = require('../controllers/recruitingController');
// const authMiddleware = require('../middleware/authMiddleware'); // Assuming this exists

// Mock Auth Middleware if not available for testing
const authMiddleware = (req, res, next) => {
    // In production, this would verify JWT and set req.user
    // Mocking for prototype generation context:
    if (!req.user) {
        req.user = { id: 'mock_agent_id', tenant_id: 'mock_tenant_id' };
    }
    next();
};

// Core Endpoints
router.get('/data', authMiddleware, recruitingController.getDashboardData);
router.get('/badges', authMiddleware, recruitingController.getBadges);

router.put('/pipelines', authMiddleware, recruitingController.savePipelines);

router.post('/recruits', authMiddleware, recruitingController.createRecruit);
router.put('/recruits/:id', authMiddleware, recruitingController.updateRecruit);

router.post('/resources', authMiddleware, recruitingController.createResource);
router.post('/packets', authMiddleware, recruitingController.createPacket);

router.post('/job-posts', authMiddleware, recruitingController.createJobPostTemplate);

// Public Feed (No Auth)
// Route: /api/recruiting/feeds/:feedId.xml
router.get('/feeds/:feedId.xml', recruitingController.getPublicFeed);

module.exports = router;
