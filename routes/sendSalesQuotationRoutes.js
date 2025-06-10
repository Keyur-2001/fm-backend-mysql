const express = require('express');
const router = express.Router();
const { sendSalesQuotation } = require('../controllers/sendSalesQuotationController');

router.post('/', sendSalesQuotation);

module.exports = router;