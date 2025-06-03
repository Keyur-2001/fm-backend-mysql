const express = require('express');
const router = express.Router();
const POParcelController = require('../controllers/poParcelController');
const authMiddleware = require('../middleware/authMiddleware');

// Get a single PO parcel by ID
router.get('/:id', POParcelController.getPOParcelById);

// Update a PO parcel
router.put('/:id', authMiddleware, POParcelController.updatePOParcel);

// Delete a PO parcel
router.delete('/:id', authMiddleware, POParcelController.deletePOParcel);

module.exports = router;