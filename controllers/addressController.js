const AddressModel = require('../models/addressModel');

class AddressController {
  static async createAddress(req, res) {
    try {
      const addressData = req.body;
      addressData.CreatedByID = req.user?.id || 1; // Assuming user ID from auth middleware
      const result = await AddressModel.createAddress(addressData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async updateAddress(req, res) {
    try {
      const addressData = req.body;
      addressData.AddressID = parseInt(req.params.id);
      addressData.CreatedByID = req.user?.id || 1; // Assuming user ID from auth middleware
      const result = await AddressModel.updateAddress(addressData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async deleteAddress(req, res) {
    try {
      const addressData = {
        AddressID: parseInt(req.params.id),
        CreatedByID: req.user?.id || 1 // Assuming user ID from auth middleware
      };
      const result = await AddressModel.deleteAddress(addressData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async getAddress(req, res) {
    try {
      const addressData = {
        AddressID: parseInt(req.params.id)
      };
      const result = await AddressModel.getAddress(addressData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async getAllAddresses(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;
      const addressData = {
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate: fromDate || null,
        toDate: toDate || null
      };
      const result = await AddressModel.getAllAddresses(addressData.pageNumber, addressData.pageSize, addressData.fromDate, addressData.toDate);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }
}

module.exports = AddressController;