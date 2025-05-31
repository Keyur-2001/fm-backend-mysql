const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/addressController');

<<<<<<< HEAD


// Routes for Address
router.post('/', AddressController.createAddress);
router.put('/:id', AddressController.updateAddress);
router.delete('/:id', AddressController.deleteAddress);
router.get('/:id',  AddressController.getAddress);
router.get('/',  AddressController.getAllAddresses);

module.exports = router;
=======
// Routes for Address management
router.get('/', AddressController.getAllAddresses); // GET /api/addresses
router.post('/', AddressController.createAddress); // POST /api/addresses
router.get('/:id', AddressController.getAddressById); // GET /api/addresses/:id
router.put('/:id', AddressController.updateAddress); // PUT /api/addresses/:id
router.delete('/:id', AddressController.deleteAddress); // DELETE /api/addresses/:id

module.exports = router;
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
