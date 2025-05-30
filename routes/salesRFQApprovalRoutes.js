const express = require('express');
const router = express.Router();
const SalesRFQApprovalController = require('../controllers/salesRFQApprovalController');
// const authMiddleware = require('../middleware/authMiddleware');

// Get Sales RFQ approvals (specific SalesRFQID or paginated)
router.get('/', SalesRFQApprovalController.getSalesRFQApprovals);

module.exports = router;