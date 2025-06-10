const express = require('express');
const router = express.Router();
const SalesQuotationController = require('../controllers/salesQuotationController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all Sales Quotations
router.get('/', SalesQuotationController.getAllSalesQuotations);

// Create a new Sales Quotation
router.post('/', authMiddleware, SalesQuotationController.createSalesQuotation);

// Get a single Sales Quotation by ID
router.get('/:id', SalesQuotationController.getSalesQuotationById);

// Update a Sales Quotation
router.put('/:id', authMiddleware, SalesQuotationController.updateSalesQuotation);

// Delete a Sales Quotation
router.delete('/:id', authMiddleware, SalesQuotationController.deleteSalesQuotation);

// Approve a Sales Quotation
router.post('/approve', authMiddleware, SalesQuotationController.approveSalesQuotation);

module.exports = router;