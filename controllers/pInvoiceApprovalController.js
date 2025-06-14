const PInvoiceApprovalModel = require('../models/pInvoiceApprovalModel');

class PInvoiceApprovalController {
  static async getPInvoiceApprovals(req, res) {
    try {
      const { pInvoiceID, pageNumber, pageSize } = req.query;

      if (pInvoiceID && isNaN(parseInt(pInvoiceID))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing PInvoiceID',
          data: null,
          pInvoiceId: null,
          totalRecords: 0
        });
      }

      const result = await PInvoiceApprovalModel.getPInvoiceApprovals({
        pInvoiceID: pInvoiceID ? parseInt(pInvoiceID) : null,
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getPInvoiceApprovals:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null,
        totalRecords: 0
      });
    }
  }

  static async getPInvoiceApprovalById(req, res) {
    try {
      const { pInvoiceID, approverID } = req.params;

      if (isNaN(parseInt(pInvoiceID)) || isNaN(parseInt(approverID))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing PInvoiceID or ApproverID',
          data: null,
          pInvoiceId: null
        });
      }

      const result = await PInvoiceApprovalModel.getPInvoiceApprovalById({
        pInvoiceID: parseInt(pInvoiceID),
        approverID: parseInt(approverID)
      });

      return res.status(result.success ? (result.data ? 200 : 404) : 400).json(result);
    } catch (err) {
      console.error('Error in getPInvoiceApprovalById:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null
      });
    }
  }

  static async createPInvoiceApproval(req, res) {
    try {
      const { pInvoiceID, approvedYN } = req.body;
      const createdByID = req.user?.personId;

      if (!pInvoiceID || approvedYN == null) {
        return res.status(400).json({
          success: false,
          message: 'PInvoiceID and ApprovedYN are required',
          data: null,
          pInvoiceId: null
        });
      }

      if (!req.user || !createdByID) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          pInvoiceId: null
        });
      }

      const approvalData = {
        PInvoiceID: parseInt(pInvoiceID),
        ApproverID: parseInt(createdByID),
        ApprovedYN: Boolean(approvedYN),
        CreatedByID: parseInt(createdByID)
      };

      const result = await PInvoiceApprovalModel.createPInvoiceApproval(approvalData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
      console.error('Error in createPInvoiceApproval:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null
      });
    }
  }

  static async updatePInvoiceApproval(req, res) {
    try {
      const { pInvoiceID, approverID, approvedYN } = req.body;
      const userID = req.user?.personId;

      if (!pInvoiceID || !approverID || approvedYN == null) {
        return res.status(400).json({
          success: false,
          message: 'PInvoiceID, ApproverID, and ApprovedYN are required',
          data: null,
          pInvoiceId: null
        });
      }

      if (!req.user || !userID) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          pInvoiceId: null
        });
      }

      const approvalData = {
        PInvoiceID: parseInt(pInvoiceID),
        ApproverID: parseInt(approverID),
        ApprovedYN: Boolean(approvedYN),
        UserID: parseInt(userID)
      };

      const result = await PInvoiceApprovalModel.updatePInvoiceApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in updatePInvoiceApproval:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null
      });
    }
  }

  static async deletePInvoiceApproval(req, res) {
    try {
      const { pInvoiceID, approverID } = req.body;
      const deletedByID = req.user?.personId;

      if (!pInvoiceID || !approverID) {
        return res.status(400).json({
          success: false,
          message: 'PInvoiceID and ApproverID are required',
          data: null,
          pInvoiceId: null
        });
      }

      if (!req.user || !deletedByID) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          pInvoiceId: null
        });
      }

      const approvalData = {
        PInvoiceID: parseInt(pInvoiceID),
        ApproverID: parseInt(approverID),
        DeletedByID: parseInt(deletedByID)
      };

      const result = await PInvoiceApprovalModel.deletePInvoiceApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in deletePInvoiceApproval:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        pInvoiceId: null
      });
    }
  }
}

module.exports = PInvoiceApprovalController;