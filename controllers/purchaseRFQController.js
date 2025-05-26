const PurchaseRFQModel = require('../models/purchaseRFQModel');

class PurchaseRFQController {
  // Get all Purchase RFQs
  static async getAllPurchaseRFQs(req, res) {
    try {
      const { pageNumber, pageSize } = req.query;
      const result = await PurchaseRFQModel.getAllPurchaseRFQs({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10
      });
      res.status(200).json({
        success: true,
        message: 'Purchase RFQ records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        purchaseRFQId: null,
        newPurchaseRFQId: null
      });
    } catch (err) {
      console.error('Error in getAllPurchaseRFQs:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        purchaseRFQId: null,
        newPurchaseRFQId: null
      });
    }
  }

  // Create a new Purchase RFQ
  static async createPurchaseRFQ(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.salesRFQId || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'SalesRFQID and CreatedByID are required.',
          data: null,
          purchaseRFQId: null,
          newPurchaseRFQId: null
        });
      }

      const result = await PurchaseRFQModel.createPurchaseRFQ(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        purchaseRFQId: null,
        newPurchaseRFQId: result.newPurchaseRFQId
      });
    } catch (err) {
      console.error('Error in createPurchaseRFQ:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        purchaseRFQId: null,
        newPurchaseRFQId: null
      });
    }
  }

  // Get a single Purchase RFQ by ID
  static async getPurchaseRFQById(req, res) {
    try {
      const { id } = req.params;
      const purchaseRFQ = await PurchaseRFQModel.getPurchaseRFQById(parseInt(id));
      if (!purchaseRFQ) {
        return res.status(404).json({
          success: false,
          message: 'Purchase RFQ not found or deleted.',
          data: null,
          purchaseRFQId: null,
          newPurchaseRFQId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Purchase RFQ retrieved successfully.',
        data: purchaseRFQ,
        purchaseRFQId: id,
        newPurchaseRFQId: null
      });
    } catch (err) {
      console.error('Error in getPurchaseRFQById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        purchaseRFQId: null,
        newPurchaseRFQId: null
      });
    }
  }

  // Update a Purchase RFQ
  static async updatePurchaseRFQ(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.salesRFQId || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'SalesRFQID and CreatedByID are required.',
          data: null,
          purchaseRFQId: null,
          newPurchaseRFQId: null
        });
      }

      const result = await PurchaseRFQModel.updatePurchaseRFQ(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        purchaseRFQId: id,
        newPurchaseRFQId: null
      });
    } catch (err) {
      console.error('Error in updatePurchaseRFQ:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        purchaseRFQId: null,
        newPurchaseRFQId: null
      });
    }
  }

  // Delete a Purchase RFQ
  static async deletePurchaseRFQ(req, res) {
    try {
      const { id } = req.params;
      const { deletedById } = req.body;
      if (!deletedById) {
        return res.status(400).json({
          success: false,
          message: 'DeletedByID is required.',
          data: null,
          purchaseRFQId: null,
          newPurchaseRFQId: null
        });
      }

      const result = await PurchaseRFQModel.deletePurchaseRFQ(parseInt(id), deletedById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        purchaseRFQId: id,
        newPurchaseRFQId: null
      });
    } catch (err) {
      console.error('Error in deletePurchaseRFQ:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        purchaseRFQId: null,
        newPurchaseRFQId: null
      });
    }
  }
}

module.exports = PurchaseRFQController;