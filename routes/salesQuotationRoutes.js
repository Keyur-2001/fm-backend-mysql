const express = require('express');
const router = express.Router();
const SalesQuotationController = require('../controllers/salesQuotationController');

// Get all Sales Quotations
router.get('/', SalesQuotationController.getAllSalesQuotations);

// Create a new Sales Quotation
router.post('/', SalesQuotationController.createSalesQuotation);

// Get a single Sales Quotation by ID
router.get('/:id', SalesQuotationController.getSalesQuotationById);

// Update a Sales Quotation
router.put('/:id', SalesQuotationController.updateSalesQuotation);

// Delete a Sales Quotation
router.delete('/:id', SalesQuotationController.deleteSalesQuotation);

module.exports = router;