const SalesInvoiceApprovalModel = require("../models/salesInvoiceApprovalModel");

class SalesInvoiceApprovalController {
  static async getSalesInvoiceApprovals(req, res) {
    try {
      const { salesInvoiceID, pageNumber, pageSize } = req.query;

      if (salesInvoiceID && isNaN(parseInt(salesInvoiceID))) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing SalesInvoiceID",
          data: null,
          salesInvoiceId: null,
          totalRecords: 0,
        });
      }

      const result = await SalesInvoiceApprovalModel.getSalesInvoiceApprovals({
        salesInvoiceID: salesInvoiceID ? parseInt(salesInvoiceID) : null,
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error("Error in getSalesInvoiceApprovals:", err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesInvoiceId: null,
        totalRecords: 0,
      });
    }
  }

  static async getSalesInvoiceApprovalById(req, res) {
    try {
      const { salesInvoiceID, approverID } = req.params;

      if (isNaN(parseInt(salesInvoiceID)) || isNaN(parseInt(approverID))) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing SalesInvoiceID or ApproverID",
          data: null,
          salesInvoiceId: null,
        });
      }

      const result =
        await SalesInvoiceApprovalModel.getSalesInvoiceApprovalById({
          salesInvoiceID: parseInt(salesInvoiceID),
          approverID: parseInt(approverID),
        });

      return res
        .status(result.success ? (result.data ? 200 : 404) : 400)
        .json(result);
    } catch (err) {
      console.error("Error in getSalesInvoiceApprovalById:", err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesInvoiceId: null,
      });
    }
  }

  static async createSalesInvoiceApproval(req, res) {
    try {
      const { salesInvoiceID, approvedYN } = req.body;
      const createdByID = req.user?.personId;

      if (!salesInvoiceID || approvedYN == null) {
        return res.status(400).json({
          success: false,
          message: "SalesInvoiceID and ApprovedYN are required",
          data: null,
          salesInvoiceId: null,
        });
      }

      if (!req.user || !createdByID) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          data: null,
          salesInvoiceId: null,
        });
      }

      const approvalData = {
        SalesInvoiceID: parseInt(salesInvoiceID),
        ApproverID: parseInt(createdByID),
        ApprovedYN: Boolean(approvedYN),
        CreatedByID: parseInt(createdByID),
      };

      const result = await SalesInvoiceApprovalModel.createSalesInvoiceApproval(
        approvalData
      );
      return res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
      console.error("Error in createSalesInvoiceApproval:", err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesInvoiceId: null,
      });
    }
  }

  static async updateSalesInvoiceApproval(req, res) {
    try {
      const { salesInvoiceID, approverID, approvedYN } = req.body;
      const userID = req.user?.personId;

      if (!salesInvoiceID || !approverID || approvedYN == null) {
        return res.status(400).json({
          success: false,
          message: "SalesInvoiceID, ApproverID, and ApprovedYN are required",
          data: null,
          salesInvoiceId: null,
        });
      }

      if (!req.user || !userID) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          data: null,
          salesInvoiceId: null,
        });
      }

      const approvalData = {
        SalesInvoiceID: parseInt(salesInvoiceID),
        ApproverID: parseInt(approverID),
        ApprovedYN: Boolean(approvedYN),
        UserID: parseInt(userID),
      };

      const result = await SalesInvoiceApprovalModel.updateSalesInvoiceApproval(
        approvalData
      );
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error("Error in updateSalesInvoiceApproval:", err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesInvoiceId: null,
      });
    }
  }

  static async deleteSalesInvoiceApproval(req, res) {
    try {
      const { salesInvoiceID, approverID } = req.body;
      const deletedByID = req.user?.personId;

      if (!salesInvoiceID || !approverID) {
        return res.status(400).json({
          success: false,
          message: "SalesInvoiceID and ApproverID are required",
          data: null,
          salesInvoiceId: null,
        });
      }

      if (!req.user || !deletedByID) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          data: null,
          salesInvoiceId: null,
        });
      }

      const approvalData = {
        SalesInvoiceID: parseInt(salesInvoiceID),
        ApproverID: parseInt(approverID),
        DeletedByID: parseInt(deletedByID),
      };

      const result = await SalesInvoiceApprovalModel.deleteSalesInvoiceApproval(
        approvalData
      );
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error("Error in deleteSalesInvoiceApproval:", err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        salesInvoiceId: null,
      });
    }
  }
}

module.exports = SalesInvoiceApprovalController;
