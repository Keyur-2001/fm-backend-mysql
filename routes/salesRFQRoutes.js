const express = require('express');
const router = express.Router();
const SalesRFQController = require('../controllers/salesRFQController');

// Get all SalesRFQs
router.get('/', SalesRFQController.getAllSalesRFQs);

// Create a new SalesRFQ
router.post('/', SalesRFQController.createSalesRFQ);

// Get a single SalesRFQ by ID
router.get('/:id', SalesRFQController.getSalesRFQById);

// Update a SalesRFQ
router.put('/:id', SalesRFQController.updateSalesRFQ);

// Delete a SalesRFQ (soft delete)
router.delete('/:id', SalesRFQController.deleteSalesRFQ);

module.exports = router;