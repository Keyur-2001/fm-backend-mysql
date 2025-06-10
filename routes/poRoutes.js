const express = require('express');
const router = express.Router();
const PurchaseOrderController = require('../controllers/poController');
const authMiddleware = require('../middleware/authMiddleware');

// Get a single purchase order by ID
router.get('/:id', PurchaseOrderController.getPurchaseOrderById);

// Get all purchase orders (paginated)
router.get('/',  PurchaseOrderController.getAllPurchaseOrders);

// Create a new purchase order
router.post('/', authMiddleware, PurchaseOrderController.createPurchaseOrder);

module.exports = router;