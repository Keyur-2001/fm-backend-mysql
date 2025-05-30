const SalesRFQApprovalModel = require('../models/salesRFQApprovalModel');

class SalesRFQApprovalController {
  // Get Sales RFQ approvals (specific SalesRFQID or paginated)
  static async getSalesRFQApprovals(req, res) {
    try {
      const { salesRFQID, pageNumber, pageSize } = req.query;

      // Validate salesRFQID if provided
      if (salesRFQID && isNaN(parseInt(salesRFQID))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesRFQID',
          data: null,
          salesRFQId: null,
          newSalesRFQId: null,
          totalRecords: 0
        });
      }

      const result = await SalesRFQApprovalModel.getSalesRFQApprovals({
        salesRFQID: salesRFQID ? parseInt(salesRFQID) : null,
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getSalesRFQApprovals:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesRFQId: null,
        newSalesRFQId: null,
        totalRecords: 0
      });
    }
  }
}

module.exports = SalesRFQApprovalController;