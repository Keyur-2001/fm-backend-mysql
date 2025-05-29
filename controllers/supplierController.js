const SupplierModel = require('../models/supplierModel');

class SupplierController {
  // Get all Suppliers with pagination
  static async getAllSuppliers(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const suppliers = await SupplierModel.getAllSuppliers({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'Suppliers retrieved successfully',
        data: suppliers.data,
        totalRecords: suppliers.totalRecords
      });
    } catch (err) {
      console.error('getAllSuppliers error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null
      });
    }
  }

  // Create a new Supplier
  static async createSupplier(req, res) {
    try {
      const {
        supplierName,
        supplierGroupId,
        supplierTypeId,
        supplierAddressId,
        supplierExportCode,
        saPartner,
        saPartnerExportCode,
        supplierEmail,
        billingCurrencyId,
        companyId,
        externalSupplierYn,
        userId
      } = req.body;

      // Basic validation
      if (!supplierName || !companyId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'SupplierName, CompanyID, and UserID are required',
          data: null,
          supplierId: null
        });
      }

      const result = await SupplierModel.createSupplier({
        supplierName,
        supplierGroupId,
        supplierTypeId,
        supplierAddressId,
        supplierExportCode,
        saPartner,
        saPartnerExportCode,
        supplierEmail,
        billingCurrencyId,
        companyId,
        externalSupplierYn,
        userId
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        supplierId: result.supplierId
      });
    } catch (err) {
      console.error('createSupplier error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null
      });
    }
  }

  // Get a single Supplier by ID
  static async getSupplierById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SupplierID is required',
          data: null,
          supplierId: null
        });
      }

      const supplier = await SupplierModel.getSupplierById(parseInt(id));

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Supplier not found',
          data: null,
          supplierId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Supplier retrieved successfully',
        data: supplier,
        supplierId: id
      });
    } catch (err) {
      console.error('getSupplierById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null
      });
    }
  }

  // Update a Supplier
  static async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const {
        supplierName,
        supplierGroupId,
        supplierTypeId,
        supplierAddressId,
        supplierExportCode,
        saPartner,
        saPartnerExportCode,
        supplierEmail,
        billingCurrencyId,
        companyId,
        externalSupplierYn,
        userId
      } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SupplierID is required',
          data: null,
          supplierId: null
        });
      }

      if (!supplierName || !companyId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'SupplierName, CompanyID, and UserID are required',
          data: null,
          supplierId: id
        });
      }

      const result = await SupplierModel.updateSupplier(parseInt(id), {
        supplierName,
        supplierGroupId,
        supplierTypeId,
        supplierAddressId,
        supplierExportCode,
        saPartner,
        saPartnerExportCode,
        supplierEmail,
        billingCurrencyId,
        companyId,
        externalSupplierYn,
        userId
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierId: id
      });
    } catch (err) {
      console.error('updateSupplier error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null
      });
    }
  }

  // Delete a Supplier
  static async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SupplierID is required',
          data: null,
          supplierId: null
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'UserID is required',
          data: null,
          supplierId: id
        });
      }

      const result = await SupplierModel.deleteSupplier(parseInt(id), userId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierId: id
      });
    } catch (err) {
      console.error('deleteSupplier error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierId: null
      });
    }
  }
}

module.exports = SupplierController;