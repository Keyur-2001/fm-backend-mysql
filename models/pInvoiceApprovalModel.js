const poolPromise = require('../config/db.config');

class PInvoiceApprovalModel {
  static async getPInvoiceApprovals({ pInvoiceID = null, pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      let queryParams = [
        'SELECT',
        pInvoiceID ? parseInt(pInvoiceID) : null,
        null, // ApproverID
        null, // ApprovedYN
        null, // ApproverDateTime
        null, // CreatedByID
        null  // DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to retrieve PInvoice approvals',
          data: null,
          pInvoiceId: pInvoiceID,
          totalRecords: 0
        };
      }

      let approvals = result[0] || [];

      if (!pInvoiceID) {
        const start = (pageNumber - 1) * pageSize;
        const end = start + pageSize;
        approvals = approvals.slice(start, end);
      }

      return {
        success: true,
        message: outParams.message || 'PInvoice Approval records retrieved successfully.',
        data: approvals,
        pInvoiceId: pInvoiceID,
        totalRecords: pInvoiceID ? approvals.length : (result[0] ? result[0].length : 0)
      };
    } catch (err) {
      console.error('Database error in getPInvoiceApprovals:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        pInvoiceId: pInvoiceID,
        totalRecords: 0
      };
    }
  }

  static async getPInvoiceApprovalById({ pInvoiceID, approverID }) {
    try {
      const pool = await poolPromise;

      if (!pInvoiceID || !approverID) {
        return {
          success: false,
          message: 'PInvoiceID and ApproverID are required',
          data: null,
          pInvoiceId: pInvoiceID
        };
      }

      const queryParams = [
        'SELECT',
        parseInt(pInvoiceID),
        parseInt(approverID),
        null, // ApprovedYN
        null, // ApproverDateTime
        null, // CreatedByID
        null  // DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to retrieve PInvoice approval',
          data: null,
          pInvoiceId: pInvoiceID
        };
      }

      const approval = result[0] && result[0][0] ? result[0][0] : null;

      return {
        success: true,
        message: approval ? (outParams.message || 'PInvoice approval retrieved successfully.') : 'No approval record found.',
        data: approval,
        pInvoiceId: pInvoiceID
      };
    } catch (err) {
      console.error('Database error in getPInvoiceApprovalById:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        pInvoiceId: pInvoiceID
      };
    }
  }

  static async createPInvoiceApproval(approvalData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['PInvoiceID', 'ApproverID', 'ApprovedYN', 'CreatedByID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          pInvoiceId: approvalData.PInvoiceID
        };
      }

      const queryParams = [
        'INSERT',
        parseInt(approvalData.PInvoiceID),
        parseInt(approvalData.ApproverID),
        approvalData.ApprovedYN ? 1 : 0,
        new Date(),
        parseInt(approvalData.CreatedByID),
        null  // DeletedByID
      ];

      await pool.query(
        'CALL SP_ManagePInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to create PInvoice approval',
          data: null,
          pInvoiceId: approvalData.PInvoiceID
        };
      }

      return {
        success: true,
        message: outParams.message || 'PInvoice approval created successfully.',
        data: null,
        pInvoiceId: approvalData.PInvoiceID
      };
    } catch (err) {
      console.error('Database error in createPInvoiceApproval:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        pInvoiceId: approvalData.PInvoiceID
      };
    }
  }

  static async updatePInvoiceApproval(approvalData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['PInvoiceID', 'ApproverID', 'ApprovedYN', 'UserID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          pInvoiceId: approvalData.PInvoiceID
        };
      }

      const queryParams = [
        'UPDATE',
        parseInt(approvalData.PInvoiceID),
        parseInt(approvalData.ApproverID),
        approvalData.ApprovedYN ? 1 : 0,
        new Date(),
        parseInt(approvalData.UserID),
        null  // DeletedByID
      ];

      await pool.query(
        'CALL SP_ManagePInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to update PInvoice approval',
          data: null,
          pInvoiceId: approvalData.PInvoiceID
        };
      }

      return {
        success: true,
        message: outParams.message || 'PInvoice approval updated successfully.',
        data: null,
        pInvoiceId: approvalData.PInvoiceID
      };
    } catch (err) {
      console.error('Database error in updatePInvoiceApproval:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        pInvoiceId: approvalData.PInvoiceID
      };
    }
  }

  static async deletePInvoiceApproval(approvalData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['PInvoiceID', 'ApproverID', 'DeletedByID'];
      const missingFields = requiredFields.filter(field => !approvalData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          pInvoiceId: approvalData.PInvoiceID
        };
      }

      const queryParams = [
        'DELETE',
        parseInt(approvalData.PInvoiceID),
        parseInt(approvalData.ApproverID),
        null, // ApprovedYN
        null, // ApproverDateTime
        null, // CreatedByID
        parseInt(approvalData.DeletedByID)
      ];

      await pool.query(
        'CALL SP_ManagePInvoiceApproval(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        return {
          success: false,
          message: outParams.message || 'Failed to delete PInvoice approval',
          data: null,
          pInvoiceId: approvalData.PInvoiceID
        };
      }

      return {
        success: true,
        message: outParams.message || 'PInvoice approval deleted successfully.',
        data: null,
        pInvoiceId: approvalData.PInvoiceID
      };
    } catch (err) {
      console.error('Database error in deletePInvoiceApproval:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        pInvoiceId: approvalData.PInvoiceID
      };
    }
  }
}

module.exports = PInvoiceApprovalModel;