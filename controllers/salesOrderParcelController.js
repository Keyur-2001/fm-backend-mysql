const SalesOrderParcelModel = require('../models/salesOrderParcelModel');

class SalesOrderParcelController {
  static async getSalesOrderParcelById(req, res) {
    try {
      const salesOrderParcelId = parseInt(req.params.id);
      if (isNaN(salesOrderParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderParcelID',
          data: null,
          salesOrderParcelId: null,
          salesOrderId: null,
          totalRecords: 0
        });
      }

      const result = await SalesOrderParcelModel.getSalesOrderParcels({
        salesOrderParcelID: salesOrderParcelId,
        salesOrderID: null,
        pageNumber: 1,
        pageSize: 10
      });

      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      console.error('Error in getSalesOrderParcelById:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesOrderParcelId: null,
        salesOrderId: null,
        totalRecords: 0
      });
    }
  }

  static async getSalesOrderParcels(req, res) {
    try {
      const { salesOrderID, pageNumber, pageSize } = req.query;

      if (salesOrderID && isNaN(parseInt(salesOrderID))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderID',
          data: null,
          salesOrderParcelId: null,
          salesOrderId: null,
          totalRecords: 0
        });
      }

      const result = await SalesOrderParcelModel.getSalesOrderParcels({
        salesOrderParcelID: null, // Not using salesOrderParcelID for this route
        salesOrderID: salesOrderID ? parseInt(salesOrderID) : null,
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getSalesOrderParcels:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesOrderParcelId: null,
        salesOrderId: null,
        totalRecords: 0
      });
    }
  }

  static async updateSalesOrderParcel(req, res) {
    try {
      const salesOrderParcelId = parseInt(req.params.id);
      if (isNaN(salesOrderParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderParcelID',
          data: null,
          salesOrderParcelId: null,
          salesOrderId: null
        });
      }

      if (!req.user || !req.user.personId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          salesOrderParcelId: null,
          salesOrderId: null
        });
      }

      const salesOrderParcelData = {
        SalesOrderParcelID: salesOrderParcelId,
        SalesOrderID: req.body.salesOrderID ? parseInt(req.body.salesOrderID) : null,
        SalesQuotationParcelID: req.body.salesQuotationParcelID ? parseInt(req.body.salesQuotationParcelID) : null,
        SupplierQuotationParcelID: req.body.supplierQuotationParcelID ? parseInt(req.body.supplierQuotationParcelID) : null,
        ParcelID: req.body.parcelID ? parseInt(req.body.parcelID) : null,
        ItemID: req.body.itemID ? parseInt(req.body.itemID) : null,
        CertificationID: req.body.certificationID ? parseInt(req.body.certificationID) : null,
        LineItemNumber: req.body.lineItemNumber ? parseInt(req.body.lineItemNumber) : null,
        RequiredByDate: req.body.requiredByDate || null,
        ItemQuantity: req.body.itemQuantity ? parseFloat(req.body.itemQuantity) : null,
        UOMID: req.body.uomID ? parseInt(req.body.uomID) : null,
        SalesRate: req.body.salesRate ? parseFloat(req.body.salesRate) : null,
        SalesAmount: req.body.salesAmount ? parseFloat(req.body.salesAmount) : null,
        CountryOfOriginID: req.body.countryOfOriginID ? parseInt(req.body.countryOfOriginID) : null,
        ChangedByID: req.user.personId
      };

      const result = await SalesOrderParcelModel.updateSalesOrderParcel(salesOrderParcelData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in updateSalesOrderParcel:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesOrderParcelId: null,
        salesOrderId: null
      });
    }
  }

  static async deleteSalesOrderParcel(req, res) {
    try {
      const salesOrderParcelId = parseInt(req.params.id);
      if (isNaN(salesOrderParcelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesOrderParcelID',
          data: null,
          salesOrderParcelId: null,
          salesOrderId: null
        });
      }

      if (!req.user || !req.user.personId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          salesOrderParcelId: null,
          salesOrderId: null
        });
      }

      const salesOrderParcelData = {
        SalesOrderParcelID: salesOrderParcelId,
        ChangedByID: req.user.personId
      };

      const result = await SalesOrderParcelModel.deleteSalesOrderParcel(salesOrderParcelData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in deleteSalesOrderParcel:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesOrderParcelId: null,
        salesOrderId: null
      });
    }
  }
}

module.exports = SalesOrderParcelController;