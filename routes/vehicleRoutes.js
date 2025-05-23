const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');

router.get('/', VehicleController.getAllVehicles);
router.post('/', VehicleController.createVehicle);
router.get('/:id', VehicleController.getVehicleById);
router.put('/:id', VehicleController.updateVehicle);
router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router;