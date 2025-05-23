// routes/serviceTypeRoutes.js
const express = require('express');
const router = express.Router();
const ServiceTypeController = require('../controllers/serviceTypeController');

// GET all service types
router.get('/', ServiceTypeController.getAllServiceTypes);

// GET a service type by ID
router.get('/:id', ServiceTypeController.getServiceTypeById);

module.exports = router;