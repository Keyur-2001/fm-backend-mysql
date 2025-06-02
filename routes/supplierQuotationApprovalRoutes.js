const express = require('express');
const router = express.Router();
const SupplierQuotationApprovalController = require('../controllers/supplierQuotationApprovalController');
const authMiddleware = require('../middleware/authMiddleware');

// Get Supplier Quotation approvals (all or filtered by SupplierQuotationID)
router.get('/', authMiddleware, SupplierQuotationApprovalController.getSupplierQuotationApprovals);

// Get a specific Supplier Quotation approval by SupplierQuotationID and ApproverID
router.get('/:supplierQuotationID/:approverID', authMiddleware, SupplierQuotationApprovalController.getSupplierQuotationApprovalById);

// Create a Supplier Quotation approval
router.post('/', authMiddleware, SupplierQuotationApprovalController.createSupplierQuotationApproval);

// Update a Supplier Quotation approval
router.put('/', authMiddleware, SupplierQuotationApprovalController.updateSupplierQuotationApproval);

// Delete a Supplier Quotation approval
router.delete('/', authMiddleware, SupplierQuotationApprovalController.deleteSupplierQuotationApproval);

module.exports = router;