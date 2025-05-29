const SalesQuotationModel = require('../models/salesQuotationModel');

class SalesQuotationController {
  // Get all Sales Quotations
  static async getAllSalesQuotations(req, res) {
    try {
      const { pageNumber, pageSize, sortColumn, sortDirection, fromDate, toDate, status, customerId, supplierId } = req.query;
      const result = await SalesQuotationModel.getAllSalesQuotations({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        sortColumn: sortColumn || 'SalesQuotationID',
        sortDirection: sortDirection || 'ASC',
        fromDate: fromDate || null,
        toDate: toDate || null,
        status: status || null,
        customerId: parseInt(customerId) || null,
        supplierId: parseInt(supplierId) || null
      });
      res.status(200).json({
        success: true,
        message: 'Sales Quotation records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        salesQuotationId: null,
        newSalesQuotationId: null
      });
    } catch (err) {
      console.error('Error in getAllSalesQuotations:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesQuotationId: null,
        newSalesQuotationId: null
      });
    }
  }

  // Create a new Sales Quotation
  static async createSalesQuotation(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.purchaseRFQId || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'PurchaseRFQID and CreatedByID are required.',
          data: null,
          salesQuotationId: null,
          newSalesQuotationId: null
        });
      }

      const result = await SalesQuotationModel.createSalesQuotation(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        salesQuotationId: null,
        newSalesQuotationId: result.newSalesQuotationId
      });
    } catch (err) {
      console.error('Error in createSalesQuotation:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesQuotationId: null,
        newSalesQuotationId: null
      });
    }
  }

  // Get a single Sales Quotation by ID
  static async getSalesQuotationById(req, res) {
    try {
      const { id } = req.params;
      const salesQuotation = await SalesQuotationModel.getSalesQuotationById(parseInt(id));
      if (!salesQuotation) {
        return res.status(404).json({
          success: false,
          message: 'Sales Quotation not found or deleted.',
          data: null,
          salesQuotationId: null,
          newSalesQuotationId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Sales Quotation retrieved successfully.',
        data: salesQuotation,
        salesQuotationId: id,
        newSalesQuotationId: null
      });
    } catch (err) {
      console.error('Error in getSalesQuotationById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesQuotationId: null,
        newSalesQuotationId: null
      });
    }
  }

  // Update a Sales Quotation
  static async updateSalesQuotation(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required.',
          data: null,
          salesQuotationId: null,
          newSalesQuotationId: null
        });
      }

      const result = await SalesQuotationModel.updateSalesQuotation(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        salesQuotationId: id,
        newSalesQuotationId: null
      });
    } catch (err) {
      console.error('Error in updateSalesQuotation:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesQuotationId: null,
        newSalesQuotationId: null
      });
    }
  }

  // Delete a Sales Quotation
  static async deleteSalesQuotation(req, res) {
    try {
      const { id } = req.params;
      const { deletedById } = req.body;
      if (!deletedById) {
        return res.status(400).json({
          success: false,
          message: 'DeletedByID is required.',
          data: null,
          salesQuotationId: null,
          newSalesQuotationId: null
        });
      }

      const result = await SalesQuotationModel.deleteSalesQuotation(parseInt(id), deletedById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        salesQuotationId: id,
        newSalesQuotationId: null
      });
    } catch (err) {
      console.error('Error in deleteSalesQuotation:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesQuotationId: null,
        newSalesQuotationId: null
      });
    }
  }
}

module.exports = SalesQuotationController;