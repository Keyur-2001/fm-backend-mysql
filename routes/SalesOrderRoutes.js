const express = require('express');
const router = express.Router();
const SalesOrderController = require('../controllers/SalesOrderController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all SalesOrders
router.get('/', SalesOrderController.getAllSalesOrders);

// Get a single SalesOrder by ID
router.get('/:id', SalesOrderController.getSalesOrder);

// Create a new SalesOrder
router.post('/', authMiddleware, SalesOrderController.createSalesOrder);

// Update a SalesOrder
router.put('/:id', authMiddleware, SalesOrderController.updateSalesOrder);

// Delete a SalesOrder (soft delete)
router.delete('/:id', authMiddleware, SalesOrderController.deleteSalesOrder);

module.exports = router;