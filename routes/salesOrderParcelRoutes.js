const express = require('express');
const router = express.Router();
const SalesOrderParcelController = require('../controllers/salesOrderParcelController');
const authMiddleware = require('../middleware/authMiddleware');

// Get a single sales order parcel by ID
router.get('/:id', authMiddleware, SalesOrderParcelController.getSalesOrderParcelById);

// Get sales order parcels (by SalesOrderID or paginated list)
router.get('/', authMiddleware, SalesOrderParcelController.getSalesOrderParcels);

// Update a sales order parcel
router.put('/:id', authMiddleware, SalesOrderParcelController.updateSalesOrderParcel);

// Delete a sales order parcel
router.delete('/:id', authMiddleware, SalesOrderParcelController.deleteSalesOrderParcel);

module.exports = router;