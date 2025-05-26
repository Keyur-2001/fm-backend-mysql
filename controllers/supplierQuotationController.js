const SupplierQuotationModel = require('../models/supplierQuotationModel');

class SupplierQuotationController {
  // Get all Supplier Quotations
  static async getAllSupplierQuotations(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;
      const result = await SupplierQuotationModel.getAllSupplierQuotations({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate,
        toDate
      });
      res.status(200).json({
        success: true,
        message: 'Supplier Quotation records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        supplierQuotationId: null,
        newSupplierQuotationId: null
      });
    } catch (err) {
      console.error('Error in getAllSupplierQuotations:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
        newSupplierQuotationId: null
      });
    }
  }

  // Create a new Supplier Quotation
  static async createSupplierQuotation(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.purchaseRFQId || !data.supplierId || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'PurchaseRFQId, SupplierId, and CreatedById are required.',
          data: null,
          supplierQuotationId: null,
          newSupplierQuotationId: null
        });
      }

      const result = await SupplierQuotationModel.createSupplierQuotation(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        supplierQuotationId: null,
        newSupplierQuotationId: result.newSupplierQuotationId
      });
    } catch (err) {
      console.error('Error in createSupplierQuotation:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
        newSupplierQuotationId: null
      });
    }
  }

  // Get a single Supplier Quotation by ID
  static async getSupplierQuotationById(req, res) {
    try {
      const { id } = req.params;
      const supplierQuotation = await SupplierQuotationModel.getSupplierQuotationById(parseInt(id));
      if (!supplierQuotation.quotation) {
        return res.status(404).json({
          success: false,
          message: 'Supplier Quotation not found or deleted.',
          data: null,
          supplierQuotationId: null,
          newSupplierQuotationId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Supplier Quotation retrieved successfully.',
        data: {
          quotation: supplierQuotation.quotation,
          parcels: supplierQuotation.parcels
        },
        supplierQuotationId: id,
        newSupplierQuotationId: null
      });
    } catch (err) {
      console.error('Error in getSupplierQuotationById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
        newSupplierQuotationId: null
      });
    }
  }

  // Update a Supplier Quotation
  static async updateSupplierQuotation(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.purchaseRFQId || !data.supplierId || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'PurchaseRFQId, SupplierId, and CreatedById are required.',
          data: null,
          supplierQuotationId: null,
          newSupplierQuotationId: null
        });
      }

      const result = await SupplierQuotationModel.updateSupplierQuotation(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierQuotationId: id,
        newSupplierQuotationId: null
      });
    } catch (err) {
      console.error('Error in updateSupplierQuotation:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
        newSupplierQuotationId: null
      });
    }
  }

  // Delete a Supplier Quotation
  static async deleteSupplierQuotation(req, res) {
    try {
      const { id } = req.params;
      const { deletedById } = req.body;
      if (!deletedById) {
        return res.status(400).json({
          success: false,
          message: 'DeletedById is required.',
          data: null,
          supplierQuotationId: null,
          newSupplierQuotationId: null
        });
      }

      const result = await SupplierQuotationModel.deleteSupplierQuotation(parseInt(id), deletedById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        supplierQuotationId: id,
        newSupplierQuotationId: null
      });
    } catch (err) {
      console.error('Error in deleteSupplierQuotation:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
        newSupplierQuotationId: null
      });
    }
  }
}

module.exports = SupplierQuotationController;