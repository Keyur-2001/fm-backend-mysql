const express = require('express');
const router = express.Router();
const PurchaseRFQApprovalController = require('../controllers/purchaseRFQApprovalController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a PurchaseRFQApproval
router.post('/', authMiddleware, PurchaseRFQApprovalController.createPurchaseRFQApproval);

// Route to get a PurchaseRFQApproval
router.get('/:purchaseRFQId/:approverId', PurchaseRFQApprovalController.getPurchaseRFQApproval);

// Route to update a PurchaseRFQApproval
router.put('/', authMiddleware, PurchaseRFQApprovalController.updatePurchaseRFQApproval);

// Route to delete a PurchaseRFQApproval
router.delete('/', authMiddleware, PurchaseRFQApprovalController.deletePurchaseRFQApproval);

// Route to get all PurchaseRFQApprovals
router.get('/', PurchaseRFQApprovalController.getAllPurchaseRFQApprovals);

// Route to get paginated PurchaseRFQApprovals
router.get('/paginated', PurchaseRFQApprovalController.getPaginatedPurchaseRFQApprovals);

module.exports = router;