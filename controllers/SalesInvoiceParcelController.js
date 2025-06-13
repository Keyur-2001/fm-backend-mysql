const SalesInvoiceParcelModel = require('../models/salesInvoiceParcelModel');

class SalesInvoiceParcelController {
  // Get all Sales Invoice Parcels
  static async getAllSalesInvoiceParcels(req, res) {
    try {
      const {
        pageNumber,
        pageSize,
        fromDate,
        toDate,
        SalesinvoiceID // Added to support query parameter
      } = req.query;

      const result = await SalesInvoiceParcelModel.getAllSalesInvoiceParcels({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate: fromDate || null,
        toDate: toDate || null,
        SalesInvoiceID: parseInt(SalesinvoiceID) || null // Handle SalesinvoiceID from query
      });

      res.status(200).json({
        success: true,
        message: 'Sales Invoice Parcels retrieved successfully.',
        data: result.data,
        pagination: {
          totalRecords: result.totalRecords,
          totalPages: Math.ceil(result.totalRecords / (parseInt(pageSize) || 10)),
          currentPage: parseInt(pageNumber) || 1,
          pageSize: parseInt(pageSize) || 10
        },
        salesInvoiceId: SalesinvoiceID || null
      });
    } catch (err) {
      console.error('Error in getAllSalesInvoiceParcels:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesInvoiceId: null
      });
    }
  }

  // Create a Sales Invoice Parcel
  static async createSalesInvoiceParcel(req, res) {
    try {
      const userId = req.user && req.user.personId ? parseInt(req.user.personId) : null;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found in authentication context.',
          data: null
        });
      }

      const data = req.body;
      // Validate required fields
      if (!data.SalesInvoiceID || !data.ItemID || !data.ItemQuantity || !data.Rate || !data.Amount) {
        return res.status(400).json({
          success: false,
          message: 'SalesInvoiceID, ItemID, ItemQuantity, Rate, and Amount are required.',
          data: null
        });
      }

      const result = await SalesInvoiceParcelModel.createSalesInvoiceParcel({ ...data, UserID: userId });

      res.status(201).json({
        success: true,
        message: result.message,
        data: { salesInvoiceParcelId: result.salesInvoiceParcelId }
      });
    } catch (err) {
      console.error('Error in createSalesInvoiceParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null
      });
    }
  }

  // Update a Sales Invoice Parcel
  static async updateSalesInvoiceParcel(req, res) {
    try {
      const userId = req.user && req.user.personId ? parseInt(req.user.personId) : null;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found in authentication context.',
          data: null
        });
      }

      const { id } = req.params;
      const salesInvoiceParcelId = parseInt(id);
      if (isNaN(salesInvoiceParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesInvoiceParcelID',
          data: null
        });
      }

      const data = { ...req.body, UserID: userId };
      const result = await SalesInvoiceParcelModel.updateSalesInvoiceParcel(salesInvoiceParcelId, data);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        salesInvoiceParcelId: id
      });
    } catch (err) {
      console.error('Error in updateSalesInvoiceParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null
      });
    }
  }

  // Delete a Sales Invoice Parcel
  static async deleteSalesInvoiceParcel(req, res) {
    try {
      const userId = req.user && req.user.personId ? parseInt(req.user.personId) : null;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID not found in authentication context.',
          data: null
        });
      }

      const { id } = req.params;
      const salesInvoiceParcelId = parseInt(id);
      if (isNaN(salesInvoiceParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesInvoiceParcelID',
          data: null
        });
      }

      const result = await SalesInvoiceParcelModel.deleteSalesInvoiceParcel(salesInvoiceParcelId, userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        salesInvoiceParcelId: id
      });
    } catch (err) {
      console.error('Error in deleteSalesInvoiceParcel:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null
      });
    }
  }
}

module.exports = SalesInvoiceParcelController;