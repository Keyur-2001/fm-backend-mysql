const express = require('express');
const router = express.Router();
const PurchaseRFQController = require('../controllers/purchaseRFQController');
const authMiddleware = require('../middleware/authMiddleware');
const tableAccessMiddleware = require('../middleware/tableAccessMiddleware');
const permissionMiddleware =  require('../middleware/permissionMiddleware')

// Get all Purchase RFQs
router.get('/',  tableAccessMiddleware, permissionMiddleware('read'), authMiddleware, PurchaseRFQController.getAllPurchaseRFQs);

// Create a new Purchase RFQ
router.post('/',  tableAccessMiddleware, permissionMiddleware('write'), authMiddleware, PurchaseRFQController.createPurchaseRFQ);

// Get a single Purchase RFQ by ID
router.get('/:id', tableAccessMiddleware, permissionMiddleware('read'),   PurchaseRFQController.getPurchaseRFQById);

// Update a Purchase RFQ
router.put('/:id', tableAccessMiddleware, permissionMiddleware('update'),  authMiddleware, PurchaseRFQController.updatePurchaseRFQ);

// Delete a Purchase RFQ
router.delete('/:id', tableAccessMiddleware, permissionMiddleware('delete'),  authMiddleware, PurchaseRFQController.deletePurchaseRFQ);

// Approve a Purchase RFQ
router.post('/approve', authMiddleware, PurchaseRFQController.approvePurchaseRFQ);

// Get Purchase RFQ approval status (requires read permission on PurchaseRFQ table)
router.get('/:id/approval-status', authMiddleware, tableAccessMiddleware, permissionMiddleware('read'), PurchaseRFQController.getPurchaseRFQApprovalStatus);

module.exports = router;