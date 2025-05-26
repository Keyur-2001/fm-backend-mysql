const express = require('express');
const router = express.Router();
const PurchaseRFQParcelController = require('../controllers/purchaseRFQParcelController');

router.post('/', PurchaseRFQParcelController.createPurchaseRFQParcel);
router.put('/:id', PurchaseRFQParcelController.updatePurchaseRFQParcel);
router.delete('/:id', PurchaseRFQParcelController.deletePurchaseRFQParcel);
router.get('/:id?', PurchaseRFQParcelController.getPurchaseRFQParcel);

module.exports = router;