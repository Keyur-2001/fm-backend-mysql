const express = require('express');
const router = express.Router();
const { sendPurchaseOrder } = require('../controllers/sendPurchaseOrderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, sendPurchaseOrder);

module.exports = router;