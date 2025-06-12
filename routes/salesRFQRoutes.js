const express = require('express');
const router = express.Router();
const SalesRFQController = require('../controllers/salesRFQController');
const authMiddleware = require('../middleware/authMiddleware');
// const tableAccessMiddleware = require('../middleware/tableAccessMiddleware');
// const permissionMiddleware = require('../middleware/permissionMiddleware');

// Get all SalesRFQs (requires read permission on SalesRFQ table)
router.get('/', SalesRFQController.getAllSalesRFQs);

// Get a single SalesRFQ by ID (requires read permission on SalesRFQ table)
router.get('/:id', SalesRFQController.getSalesRFQ);

// Create a new SalesRFQ (requires write permission on SalesRFQ table)
router.post('/', SalesRFQController.createSalesRFQ);

// Update a SalesRFQ (requires update permission on SalesRFQ table)
router.put('/:id',  SalesRFQController.updateSalesRFQ);

// Delete a SalesRFQ (soft delete, requires delete permission on SalesRFQ table)
router.delete('/:id',  SalesRFQController.deleteSalesRFQ);

// Approve a SalesRFQ (requires write permission on SalesRFQ table, as approval involves creating/updating records)
router.post('/approve',  authMiddleware, SalesRFQController.approveSalesRFQ);

// Get SalesRFQ approval status (requires read permission on SalesRFQ table)
router.get('/:id/approval-status', authMiddleware, SalesRFQController.getSalesRFQApprovalStatus);

module.exports = router; 