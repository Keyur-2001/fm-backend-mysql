const express = require('express');
const router = express.Router();
const SupplierQuotationController = require('../controllers/supplierQuotationController');
const authMiddleware = require('../middleware/authMiddleware')

// Get all Supplier Quotations
router.get('/', SupplierQuotationController.getAllSupplierQuotations);

// Create a new Supplier Quotation
router.post('/',authMiddleware, SupplierQuotationController.createSupplierQuotation);

// Get a single Supplier Quotation by ID
router.get('/:id', SupplierQuotationController.getSupplierQuotationById);

// Update a Supplier Quotation
router.put('/:id', SupplierQuotationController.updateSupplierQuotation);

// Delete a Supplier Quotation
router.delete('/:id', SupplierQuotationController.deleteSupplierQuotation);

module.exports = router;