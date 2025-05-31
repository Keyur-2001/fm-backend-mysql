const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/addressController');



// Routes for Address
router.post('/', AddressController.createAddress);
router.put('/:id', AddressController.updateAddress);
router.delete('/:id', AddressController.deleteAddress);
router.get('/:id',  AddressController.getAddress);
router.get('/',  AddressController.getAllAddresses);

module.exports = router;
