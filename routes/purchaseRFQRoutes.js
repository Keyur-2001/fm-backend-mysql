const express = require('express');
const router = express.Router();
const PurchaseRFQController = require('../controllers/purchaseRFQController');

// Get all Purchase RFQs
router.get('/', PurchaseRFQController.getAllPurchaseRFQs);

// Create a new Purchase RFQ
router.post('/', PurchaseRFQController.createPurchaseRFQ);

// Get a single Purchase RFQ by ID
router.get('/:id', PurchaseRFQController.getPurchaseRFQById);

// Update a Purchase RFQ
router.put('/:id', PurchaseRFQController.updatePurchaseRFQ);

// Delete a Purchase RFQ
router.delete('/:id', PurchaseRFQController.deletePurchaseRFQ);

module.exports = router;