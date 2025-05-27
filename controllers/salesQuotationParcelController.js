const SalesQuotationParcelModel = require('../models/salesQuotationParcelModel');

class SalesQuotationParcelController {
  static async getSalesQuotationParcel(req, res) {
    try {
      const salesQuotationParcelData = {
        SalesQuotationParcelID: req.query.salesQuotationParcelID ? parseInt(req.query.salesQuotationParcelID) : null,
        SalesQuotationID: req.query.salesQuotationID ? parseInt(req.query.salesQuotationID) : null,
        SupplierQuotationParcelID: req.query.supplierQuotationParcelID ? parseInt(req.query.supplierQuotationParcelID) : null,
        ItemID: req.query.itemID ? parseInt(req.query.itemID) : null,
        CertificationID: req.query.certificationID ? parseInt(req.query.certificationID) : null
      };

      const result = await SalesQuotationParcelModel.getSalesQuotationParcel(salesQuotationParcelData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get SalesQuotationParcel error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationParcelId: null
      });
    }
  }

  static async updateSalesQuotationParcel(req, res) {
    try {
      // Check if user has permission to update SalesQuotationParcel
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can update SalesQuotationParcel',
          data: null,
          salesQuotationParcelId: null
        });
      }

      const salesQuotationParcelId = parseInt(req.params.id);
      if (isNaN(salesQuotationParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesQuotationParcelID',
          data: null,
          salesQuotationParcelId: null
        });
      }

      const salesQuotationParcelData = {
        SalesQuotationParcelID: salesQuotationParcelId,
        SalesQuotationID: req.body.salesQuotationID ? parseInt(req.body.salesQuotationID) : null,
        SupplierQuotationParcelID: req.body.supplierQuotationParcelID ? parseInt(req.body.supplierQuotationParcelID) : null,
        ParcelID: req.body.parcelID ? parseInt(req.body.parcelID) : null,
        ItemID: req.body.itemID ? parseInt(req.body.itemID) : null,
        CertificationID: req.body.certificationID ? parseInt(req.body.certificationID) : null,
        LineItemNumber: req.body.lineItemNumber ? parseInt(req.body.lineItemNumber) : null,
        ItemQuantity: req.body.itemQuantity ? parseFloat(req.body.itemQuantity) : null,
        UOMID: req.body.uomID ? parseInt(req.body.uomID) : null,
        CountryOfOriginID: req.body.countryOfOriginID ? parseInt(req.body.countryOfOriginID) : null,
        SupplierRate: req.body.supplierRate ? parseFloat(req.body.supplierRate) : null,
        SupplierAmount: req.body.supplierAmount ? parseFloat(req.body.supplierAmount) : null,
        SalesRate: req.body.salesRate ? parseFloat(req.body.salesRate) : null,
        SalesAmount: req.body.salesAmount ? parseFloat(req.body.salesAmount) : null,
        Profit: req.body.profit ? parseFloat(req.body.profit) : null,
        UserID: parseInt(req.body.userID) || req.user.personId, // Use authenticated user's personId
        DebugMode: req.body.debugMode != null ? Boolean(req.body.debugMode) : false
      };

      const result = await SalesQuotationParcelModel.updateSalesQuotationParcel(salesQuotationParcelData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update SalesQuotationParcel error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationParcelId: null
      });
    }
  }

  static async deleteSalesQuotationParcel(req, res) {
    try {
      // Check if user has permission to delete SalesQuotationParcel
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can delete SalesQuotationParcel',
          data: null,
          salesQuotationParcelId: null
        });
      }

      const salesQuotationParcelId = parseInt(req.params.id);
      if (isNaN(salesQuotationParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesQuotationParcelID',
          data: null,
          salesQuotationParcelId: null
        });
      }

      const salesQuotationParcelData = {
        SalesQuotationParcelID: salesQuotationParcelId,
        UserID: parseInt(req.body.userID) || req.user.personId // Use authenticated user's personId
      };

      const result = await SalesQuotationParcelModel.deleteSalesQuotationParcel(salesQuotationParcelData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete SalesQuotationParcel error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationParcelId: null
      });
    }
  }

  static async getAllSalesQuotationParcels(req, res) {
    try {
      const paginationData = {
        PageNumber: req.query.pageNumber ? parseInt(req.query.pageNumber) : 1,
        PageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
        SortColumn: req.query.sortColumn || 'CreatedDateTime',
        SortOrder: req.query.sortOrder && ['ASC', 'DESC'].includes(req.query.sortOrder.toUpperCase()) ? req.query.sortOrder.toUpperCase() : 'DESC',
        StartDate: req.query.startDate || null,
        EndDate: req.query.endDate || null,
        SalesQuotationID: req.query.salesQuotationID ? parseInt(req.query.salesQuotationID) : null,
        CreatedByID: req.query.createdByID ? parseInt(req.query.createdByID) : null
      };

      // Validate pagination parameters
      if (paginationData.PageNumber < 1) paginationData.PageNumber = 1;
      if (paginationData.PageSize < 1) paginationData.PageSize = 10;

      const result = await SalesQuotationParcelModel.getAllSalesQuotationParcels(paginationData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get All SalesQuotationParcels error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationParcelId: null
      });
    }
  }
}

module.exports = SalesQuotationParcelController;