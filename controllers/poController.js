const PurchaseOrderModel = require('../models/poModel');

class PurchaseOrderController {
  static async getPurchaseOrderById(req, res) {
    try {
      const poId = parseInt(req.params.id);
      if (isNaN(poId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing POID',
          data: null,
          poId: null
        });
      }

      const result = await PurchaseOrderModel.getPurchaseOrderById(poId);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      console.error('Error in getPurchaseOrderById:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        poId: null
      });
    }
  }

  static async getAllPurchaseOrders(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const result = await PurchaseOrderModel.getAllPurchaseOrders({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate: fromDate || null,
        toDate: toDate || null
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getAllPurchaseOrders:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: [],
        totalRecords: 0
      });
    }
  }

  static async createPurchaseOrder(req, res) {
    try {
      if (!req.user || !req.user.personId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          poId: null
        });
      }

      const purchaseOrderData = {
        SalesOrderID: req.body.salesOrderID ? parseInt(req.body.salesOrderID) : null,
        CreatedByID: req.user.personId
      };

      const result = await PurchaseOrderModel.createPurchaseOrder(purchaseOrderData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
      console.error('Error in createPurchaseOrder:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        poId: null
      });
    }
  }
}

module.exports = PurchaseOrderController;