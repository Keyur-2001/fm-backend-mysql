const poolPromise = require('../config/db.config');

class SalesInvoiceApprovalModel {
  static async getSalesInvoiceApprovals({ salesInvoiceID = null, pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      let queryParams = [
        'SELECT',
        salesInvoiceID ? parseInt(salesInvoiceID) : null,
        null, // ApproverID
        null, // ApprovedYN
        null, // ApproverDateTime
        null, // CreatedByID
        null  // DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to retrieve SalesInvoice approvals',
          data: null,
          salesInvoiceId: salesInvoiceID,
          totalRecords: 0
        };
      }

      let approvals = result[0] || [];

      if (!salesInvoiceID) {
        const start = (pageNumber - 1) * pageSize;
        const end = start + pageSize;
        approvals = approvals.slice(start, end);
      }

      return {
        success: true,
        message: outParams.message || 'SalesInvoice Approval records retrieved successfully.',
        data: approvals,
        salesInvoiceId: salesInvoiceID,
        totalRecords: salesInvoiceID ? approvals.length : (result[0] ? result[0].length : 0)
      };
    } catch (err) {
      console.error('Database error in getSalesInvoiceApprovals:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        salesInvoiceId: salesInvoiceID,
        totalRecords: 0
      };
    }
  }

  static async getSalesInvoiceApprovalById({ salesInvoiceID, approverID }) {
    try {
      const pool = await poolPromise;

      if (!salesInvoiceID || !approverID) {
        return {
          success: false,
          message: 'SalesInvoiceID and ApproverID are required',
          data: null,
          salesInvoiceId: salesInvoiceID
        };
      }

      const queryParams = [
        'SELECT',
        parseInt(salesInvoiceID),
        parseInt(approverID),
        null, // ApprovedYN
        null, // ApproverDateTime
        null, // CreatedByID
        null  // DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to retrieve SalesInvoice approval',
          data: null,
          salesInvoiceId: salesInvoiceID
        };
      }

      const approval = result[0] && result[0][0] ? result[0][0] : null;

      return {
        success: true,
        message: approval ? (outParams.message || 'SalesInvoice approval retrieved successfully.') : 'No approval record found.',
        data: approval,
        salesInvoiceId: salesInvoiceID
      };
    } catch (err) {
      console.error('Database error in getSalesInvoiceApprovalById:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        salesInvoiceId: salesInvoiceID
      };
    }
  }

  static async createSalesInvoiceApproval(approvalData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['SalesInvoiceID', 'ApproverID', 'ApprovedYN', 'CreatedByID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          salesInvoiceId: approvalData.SalesInvoiceID
        };
      }

      const queryParams = [
        'INSERT',
        parseInt(approvalData.SalesInvoiceID),
        parseInt(approvalData.ApproverID),
        approvalData.ApprovedYN ? 1 : 0,
        new Date(),
        parseInt(approvalData.CreatedByID),
        null  // DeletedByID
      ];

      await pool.query(
        'CALL SP_ManageSalesInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to create SalesInvoice approval',
          data: null,
          salesInvoiceId: approvalData.SalesInvoiceID
        };
      }

      return {
        success: true,
        message: outParams.message || 'SalesInvoice approval created successfully.',
        data: null,
        salesInvoiceId: approvalData.SalesInvoiceID
      };
    } catch (err) {
      console.error('Database error in createSalesInvoiceApproval:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        salesInvoiceId: approvalData.SalesInvoiceID
      };
    }
  }

  static async updateSalesInvoiceApproval(approvalData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['SalesInvoiceID', 'ApproverID', 'ApprovedYN', 'UserID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          salesInvoiceId: approvalData.SalesInvoiceID
        };
      }

      const queryParams = [
        'UPDATE',
        parseInt(approvalData.SalesInvoiceID),
        parseInt(approvalData.ApproverID),
        approvalData.ApprovedYN ? 1 : 0,
        new Date(),
        parseInt(approvalData.UserID),
        null  // DeletedByID
      ];

      await pool.query(
        'CALL SP_ManageSalesInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to update SalesInvoice approval',
          data: null,
          salesInvoiceId: approvalData.SalesInvoiceID
        };
      }

      return {
        success: true,
        message: outParams.message || 'SalesInvoice approval updated successfully.',
        data: null,
        salesInvoiceId: approvalData.SalesInvoiceID
      };
    } catch (err) {
      console.error('Database error in updateSalesInvoiceApproval:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        salesInvoiceId: approvalData.SalesInvoiceID
      };
    }
  }

  static async deleteSalesInvoiceApproval(approvalData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['SalesInvoiceID', 'ApproverID', 'DeletedByID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          salesInvoiceId: approvalData.SalesInvoiceID
        };
      }

      const queryParams = [
        'DELETE',
        parseInt(approvalData.SalesInvoiceID),
        parseInt(approvalData.ApproverID),
        null, // ApprovedYN
        null, // ApproverDateTime
        null, // CreatedByID
        parseInt(approvalData.DeletedByID)
      ];

      await pool.query(
        'CALL SP_ManageSalesInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to delete SalesInvoice approval',
          data: null,
          salesInvoiceId: approvalData.SalesInvoiceID
        };
      }

      return {
        success: true,
        message: outParams.message || 'SalesInvoice approval deleted successfully.',
        data: null,
        salesInvoiceId: approvalData.SalesInvoiceID
      };
    } catch (err) {
      console.error('Database error in deleteSalesInvoiceApproval:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        salesInvoiceId: approvalData.SalesInvoiceID
      };
    }
  }
}

module.exports = SalesInvoiceApprovalModel;