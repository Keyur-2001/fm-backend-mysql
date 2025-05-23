const express = require('express');
const router = express.Router();
const SalesQuotationController = require('../controllers/salesQuotationController');
// const authMiddleware = require('../middleware/authMiddleware');

// Route to create a SalesQuotation
router.post('/',  SalesQuotationController.createSalesQuotation);

// Route to update a SalesQuotation
router.put('/:id', SalesQuotationController.updateSalesQuotation);

// Route to delete a SalesQuotation
router.delete('/:id',  SalesQuotationController.deleteSalesQuotation);

// Route to get a specific SalesQuotation
router.get('/:id',  SalesQuotationController.getSalesQuotation);

// Route to get all SalesQuotations with pagination
router.get('/', SalesQuotationController.getAllSalesQuotations);

module.exports = router;