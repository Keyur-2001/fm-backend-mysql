const express = require('express');
const router = express.Router();
const PInvoiceApprovalController = require('../controllers/pInvoiceApprovalController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, PInvoiceApprovalController.getPInvoiceApprovals);

router.get('/:pInvoiceID/:approverID', PInvoiceApprovalController.getPInvoiceApprovalById);

router.post('/', authMiddleware, PInvoiceApprovalController.createPInvoiceApproval);

router.put('/', authMiddleware, PInvoiceApprovalController.updatePInvoiceApproval);

router.delete('/', authMiddleware, PInvoiceApprovalController.deletePInvoiceApproval);

module.exports = router;