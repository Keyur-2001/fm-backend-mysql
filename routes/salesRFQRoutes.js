const express = require('express');
const router = express.Router();
const SalesRFQController = require('../controllers/salesRFQController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all SalesRFQs
router.get('/', SalesRFQController.getAllSalesRFQs);

// Get a single SalesRFQ by ID
router.get('/:id', SalesRFQController.getSalesRFQ);

// Create a new SalesRFQ
router.post('/', SalesRFQController.createSalesRFQ);

// Update a SalesRFQ
router.put('/:id', authMiddleware, SalesRFQController.updateSalesRFQ);

// Delete a SalesRFQ (soft delete)
router.delete('/:id', authMiddleware, SalesRFQController.deleteSalesRFQ);

// Approve a SalesRFQ
router.post('/approve', authMiddleware, SalesRFQController.approveSalesRFQ);

module.exports = router; 