const VehicleModel = require('../models/vehicleModel');

class VehicleController {
  static async getAllVehicles(req, res) {
    try {
      const { pageNumber, pageSize } = req.query;

      const vehicles = await VehicleModel.getAllVehicles({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize)
      });

      return res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: vehicles.data,
        totalRecords: vehicles.totalRecords
      });
    } catch (err) {
      console.error('getAllVehicles error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        vehicleId: null
      });
    }
  }

  static async createVehicle(req, res) {
    try {
      const {
        truckNumberPlate, vin, companyId, maxWeight, maxVolume, length, width, height,
        vehicleTypeId, numberOfWheels, numberOfAxels, createdById
      } = req.body;

      if (!truckNumberPlate || !companyId || !vehicleTypeId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'TruckNumberPlate, CompanyID, VehicleTypeID, and CreatedByID are required',
          data: null,
          vehicleId: null
        });
      }

      const result = await VehicleModel.createVehicle({
        truckNumberPlate, vin, companyId, maxWeight, maxVolume, length, width, height,
        vehicleTypeId, numberOfWheels, numberOfAxels, createdById
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        vehicleId: result.vehicleId
      });
    } catch (err) {
      console.error('createVehicle error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        vehicleId: null
      });
    }
  }

  static async getVehicleById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid VehicleID is required',
          data: null,
          vehicleId: null
        });
      }

      const vehicle = await VehicleModel.getVehicleById(parseInt(id));

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found',
          data: null,
          vehicleId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: vehicle,
        vehicleId: id
      });
    } catch (err) {
      console.error('getVehicleById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        vehicleId: null
      });
    }
  }

  static async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const {
        truckNumberPlate, vin, companyId, maxWeight, maxVolume, length, width, height,
        vehicleTypeId, numberOfWheels, numberOfAxels, createdById
      } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid VehicleID is required',
          data: null,
          vehicleId: null
        });
      }

      if (!truckNumberPlate || !companyId || !vehicleTypeId || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'TruckNumberPlate, CompanyID, VehicleTypeID, and CreatedByID are required',
          data: null,
          vehicleId: id
        });
      }

      const result = await VehicleModel.updateVehicle(parseInt(id), {
        truckNumberPlate, vin, companyId, maxWeight, maxVolume, length, width, height,
        vehicleTypeId, numberOfWheels, numberOfAxels, createdById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        vehicleId: id
      });
    } catch (err) {
      console.error('updateVehicle error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        vehicleId: null
      });
    }
  }

  static async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid VehicleID is required',
          data: null,
          vehicleId: null
        });
      }

      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required',
          data: null,
          vehicleId: id
        });
      }

      const result = await VehicleModel.deleteVehicle(parseInt(id), createdById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        vehicleId: id
      });
    } catch (err) {
      console.error('deleteVehicle error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        vehicleId: null
      });
    }
  }
}

module.exports = VehicleController;