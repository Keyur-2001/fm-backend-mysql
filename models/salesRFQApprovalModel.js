const poolPromise = require('../config/db.config');

class SalesRFQApprovalModel {
  // Get Sales RFQ approvals (specific SalesRFQID or paginated)
  static async getSalesRFQApprovals({ salesRFQID = null, pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        salesRFQID ? parseInt(salesRFQID) : null,
        pageNumber > 0 ? parseInt(pageNumber) : 1,
        pageSize > 0 ? parseInt(pageSize) : 10
      ];

      // Call SP_GetAllSalesRFQApprovals
      const [result] = await pool.query(
        'CALL SP_GetAllSalesRFQApprovals(?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 0) {
        return {
          success: false,
          message: outParams.message || 'Failed to retrieve SalesRFQ approvals',
          data: null,
          salesRFQId: salesRFQID,
          newSalesRFQId: null,
          totalRecords: 0
        };
      }

      // If salesRFQID is provided, result is not paginated
      if (salesRFQID) {
        return {
          success: true,
          message: outParams.message || 'SalesRFQ Approval records retrieved successfully.',
          data: result[0] || [],
          salesRFQId: salesRFQID,
          newSalesRFQId: null,
          totalRecords: result[0].length
        };
      }

      // For paginated results, extract totalRecords from the result set
      const totalRecords = result[0].length > 0 ? result[0][0].TotalRecords || 0 : 0;

      return {
        success: true,
        message: outParams.message || 'SalesRFQ Approval records retrieved successfully.',
        data: result[0] || [],
        salesRFQId: null,
        newSalesRFQId: null,
        totalRecords
      };
    } catch (err) {
      console.error('Database error in getSalesRFQApprovals:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        salesRFQId: salesRFQID,
        newSalesRFQId: null,
        totalRecords: 0
      };
    }
  }
}

module.exports = SalesRFQApprovalModel;