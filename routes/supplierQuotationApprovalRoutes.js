const express = require('express');
const router = express.Router();
const SupplierQuotationApprovalController = require('../controllers/supplierQuotationApprovalController');

router.post('/', SupplierQuotationApprovalController.createSupplierQuotationApproval);
router.put('/:id', SupplierQuotationApprovalController.updateSupplierQuotationApproval);
router.delete('/:id', SupplierQuotationApprovalController.deleteSupplierQuotationApproval);
router.get('/:id', SupplierQuotationApprovalController.getSupplierQuotationApproval);
router.get('/', SupplierQuotationApprovalController.getAllSupplierQuotationApprovals);

module.exports = router;