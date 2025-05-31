const express = require('express');
const router = express.Router();
const POController = require('../controllers/poController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, POController.createPO);
router.get('/', authMiddleware, POController.getAllPOs);

module.exports = router;