const SupplierModel = require('../models/supplierModel');

class SupplierController {
  // Get all Suppliers
  static async getAllSuppliers(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;
      const result = await SupplierModel.getAllSuppliers({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate: fromDate || null,
        toDate: toDate || null
      });
      res.status(200).json({
        success: true,
        message: 'Supplier records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        supplierId: null,
        newSupplierId: null
      });
    } catch (err) {
      console.error('Error in getAllSuppliers:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null,
        newSupplierId: null
      });
    }
  }

  // Create a new Supplier
  static async createSupplier(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.supplierName || !data.userId) {
        return res.status(400).json({
          success: false,
          message: 'SupplierName and UserID are required.',
          data: null,
          supplierId: null,
          newSupplierId: null
        });
      }

      const result = await SupplierModel.createSupplier(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        supplierId: null,
        newSupplierId: result.newSupplierId
      });
    } catch (err) {
      console.error('Error in createSupplier:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null,
        newSupplierId: null
      });
    }
  }

  // Get a single Supplier by ID
  static async getSupplierById(req, res) {
    try {
      const { id } = req.params;
      const supplier = await SupplierModel.getSupplierById(parseInt(id));
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Supplier not found.',
          data: null,
          supplierId: null,
          newSupplierId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Supplier retrieved successfully.',
        data: supplier,
        supplierId: id,
        newSupplierId: null
      });
    } catch (err) {
      console.error('Error in getSupplierById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null,
        newSupplierId: null
      });
    }
  }

  // Update a Supplier
  static async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.userId) {
        return res.status(400).json({
          success: false,
          message: 'UserID is required.',
          data: null,
          supplierId: null,
          newSupplierId: null
        });
      }

      const result = await SupplierModel.updateSupplier(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierId: id,
        newSupplierId: null
      });
    } catch (err) {
      console.error('Error in updateSupplier:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null,
        newSupplierId: null
      });
    }
  }

  // Delete a Supplier
  static async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'UserID is required.',
          data: null,
          supplierId: null,
          newSupplierId: null
        });
      }

      const result = await SupplierModel.deleteSupplier(parseInt(id), userId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierId: id,
        newSupplierId: null
      });
    } catch (err) {
      console.error('Error in deleteSupplier:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null,
        newSupplierId: null
      });
    }
  }
}

module.exports = SupplierController;