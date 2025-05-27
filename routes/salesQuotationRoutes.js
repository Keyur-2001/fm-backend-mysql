const express = require('express');
const router = express.Router();
const {
  createSalesQuotation,
  updateSalesQuotation,
  deleteSalesQuotation,
  getSalesQuotation,
} = require('../controllers/salesQuotationController');

// Create a new sales quotation
router.post('/', createSalesQuotation);

// Update a sales quotation by ID
router.put('/:id', updateSalesQuotation);

// Delete a sales quotation by ID
router.delete('/:id', deleteSalesQuotation);

// Get a sales quotation by ID
router.get('/:id', getSalesQuotation);

module.exports = router;