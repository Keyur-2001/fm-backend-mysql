const CountryOfOriginModel = require('../models/countryOfOriginModel');

class CountryOfOriginController {
  // Create a new Country of Origin
  static async createCountryOfOrigin(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.countryOfOrigin || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'CountryOfOrigin and CreatedById are required.',
          data: null,
          countryOfOriginId: null
        });
      }

      const result = await CountryOfOriginModel.createCountryOfOrigin(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        countryOfOriginId: result.countryOfOriginId
      });
    } catch (err) {
      console.error('Error in createCountryOfOrigin:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        countryOfOriginId: null
      });
    }
  }

  // Get a single Country of Origin by ID
  static async getCountryOfOriginById(req, res) {
    try {
      const { id } = req.params;
      const countryOfOrigin = await CountryOfOriginModel.getCountryOfOriginById(parseInt(id));
      if (!countryOfOrigin) {
        return res.status(400).json({
          success: false,
          message: 'Country of Origin not found.',
          data: null,
          countryOfOriginId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Country of Origin retrieved successfully.',
        data: countryOfOrigin,
        countryOfOriginId: id
      });
    } catch (err) {
      console.error('Error in getCountryOfOriginById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        countryOfOriginId: null
      });
    }
  }

  // Update a Country of Origin
  static async updateCountryOfOrigin(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedById is required.',
          data: null,
          countryOfOriginId: null
        });
      }

      const result = await CountryOfOriginModel.updateCountryOfOrigin(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        countryOfOriginId: id
      });
    } catch (err) {
      console.error('Error in updateCountryOfOrigin:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        countryOfOriginId: null
      });
    }
  }

  // Delete a Country of Origin
  static async deleteCountryOfOrigin(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body; // No validation, pass as-is

      const result = await CountryOfOriginModel.deleteCountryOfOrigin(parseInt(id), createdById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        countryOfOriginId: id
      });
    } catch (err) {
      console.error('Error in deleteCountryOfOrigin:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        countryOfOriginId: null
      });
    }
  }
}

module.exports = CountryOfOriginController;