const express = require('express');
const router = express.Router();
const PurchaseRFQController = require('../controllers/purchaseRFQController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all Purchase RFQs
router.get('/',  PurchaseRFQController.getAllPurchaseRFQs);

// Create a new Purchase RFQ
router.post('/', authMiddleware, PurchaseRFQController.createPurchaseRFQ);

// Get a single Purchase RFQ by ID
router.get('/:id',  PurchaseRFQController.getPurchaseRFQById);

// Update a Purchase RFQ
router.put('/:id', authMiddleware, PurchaseRFQController.updatePurchaseRFQ);

// Delete a Purchase RFQ
router.delete('/:id', authMiddleware, PurchaseRFQController.deletePurchaseRFQ);

// Approve a Purchase RFQ
router.post('/approve', authMiddleware, PurchaseRFQController.approvePurchaseRFQ);

module.exports = router;