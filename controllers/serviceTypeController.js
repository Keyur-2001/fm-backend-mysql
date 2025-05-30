// controllers/serviceTypeController.js
const ServiceTypeModel = require('../models/serviceTypeModel');
// No need for sql or dbConfig since ServiceTypeModel handles the connection

class ServiceTypeController {
  // Handle GET request for all service types
  static async getAllServiceTypes(req, res) {
    try {
      const serviceTypes = await ServiceTypeModel.getAllServiceTypes();

      res.status(200).json({
        success: true,
        data: serviceTypes,
        count: serviceTypes.length
      });
    } catch (err) {
      console.error('Error in getAllServiceTypes:', err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }

  // Handle GET request for a service type by ID
  static async getServiceTypeById(req, res) {
    try {
      const serviceType = await ServiceTypeModel.getServiceTypeById(req.params.id);

      if (!serviceType) {
        return res.status(404).json({
          success: false,
          message: `Service Type with ID ${req.params.id} not found`
        });
      }

      res.status(200).json({
        success: true,
        data: serviceType
      });
    } catch (err) {
      console.error(`Error in getServiceTypeById for ID ${req.params.id}:`, err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  }
}

module.exports = ServiceTypeController;