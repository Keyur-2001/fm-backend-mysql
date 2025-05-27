const express = require('express');
const router = express.Router();
const {
  createSalesQuotation,
  updateSalesQuotation,
  deleteSalesQuotation,
  getSalesQuotation,
} = require('../controllers/salesQuotationController');

router.post('/create', createSalesQuotation);
router.put('/update', updateSalesQuotation);
router.delete('/delete', deleteSalesQuotation);
router.get('/get', getSalesQuotation);

module.exports = router;