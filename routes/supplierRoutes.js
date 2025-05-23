const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplierController');

// Get all Suppliers
router.get('/', SupplierController.getAllSuppliers);

// Create a new Supplier
router.post('/', SupplierController.createSupplier);

// Get a single Supplier by ID
router.get('/:id', SupplierController.getSupplierById);

// Update a Supplier
router.put('/:id', SupplierController.updateSupplier);

// Delete a Supplier
router.delete('/:id', SupplierController.deleteSupplier);

module.exports = router;