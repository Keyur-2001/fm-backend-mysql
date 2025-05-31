const POModel = require('../models/poModel');

class POController {
  static async createPO(req, res) {
    try {
      const { salesOrderId } = req.body;
      const createdById = req.user ? req.user.personId : null;

      if (!salesOrderId || isNaN(salesOrderId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SalesOrderID is required',
          data: null,
          poId: null
        });
      }

      if (!createdById) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          poId: null
        });
      }

      const result = await POModel.createPO({
        salesOrderId: parseInt(salesOrderId),
        createdById
      });

      return res.status(result.success ? 201 : 400).json({
        success: result.success,
        message: result.message,
        data: null,
        poId: result.poId
      });
    } catch (err) {
      console.error('createPO error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        poId: null
      });
    }
  }

  static async getAllPOs(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      const pos = await POModel.getAllPOs({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'POs retrieved successfully',
        data: pos.data,
        totalRecords: pos.totalRecords,
        poId: null
      });
    } catch (err) {
      console.error('getAllPOs error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        poId: null
      });
    }
  }
}

module.exports = POController;