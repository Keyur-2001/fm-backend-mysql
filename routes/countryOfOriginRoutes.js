const express = require('express');
const router = express.Router();
const CountryOfOriginController = require('../controllers/countryOfOriginController');

// Create a new Country of Origin
router.post('/', CountryOfOriginController.createCountryOfOrigin);

// Get a Country of Origin by ID
router.get('/:id', CountryOfOriginController.getCountryOfOriginById);

// Update a Country of Origin
router.put('/:id', CountryOfOriginController.updateCountryOfOrigin);

// Delete a Country of Origin
router.delete('/:id', CountryOfOriginController.deleteCountryOfOrigin);

module.exports = router;