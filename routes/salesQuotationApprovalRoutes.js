const express = require('express');
const router = express.Router();
const SalesQuotationApprovalController = require('../controllers/salesQuotationApprovalController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a SalesQuotationApproval
router.post('/', authMiddleware, SalesQuotationApprovalController.createSalesQuotationApproval);

// Route to get a SalesQuotationApproval
router.get('/:salesQuotationId/:approverId', SalesQuotationApprovalController.getSalesQuotationApproval);

// Route to update a SalesQuotationApproval
router.put('/', authMiddleware, SalesQuotationApprovalController.updateSalesQuotationApproval);

// Route to delete a SalesQuotationApproval
router.delete('/', authMiddleware, SalesQuotationApprovalController.deleteSalesQuotationApproval);

module.exports = router;