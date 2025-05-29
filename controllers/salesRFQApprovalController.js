const SalesRFQApprovalModel = require('../models/salesRFQApprovalModel');

class SalesRFQApprovalController {
  static async createSalesRFQApproval(req, res) {
    try {
      const approvalData = {
        SalesRFQID: parseInt(req.body.SalesRFQID),
        ApproverID: parseInt(req.body.ApproverID),
        ApprovedYN: req.body.ApprovedYN != null ? Boolean(req.body.ApprovedYN) : null,
        FormName: req.body.FormName,
        RoleName: req.body.RoleName,
        UserID: parseInt(req.body.UserID) || 2
      };

      const result = await SalesRFQApprovalModel.createSalesRFQApproval(approvalData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Create SalesRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesRFQId: null
      });
    }
  }

  static async updateSalesRFQApproval(req, res) {
    try {
      const approvalData = {
        SalesRFQID: parseInt(req.body.SalesRFQID),
        ApproverID: parseInt(req.body.ApproverID),
        ApprovedYN: req.body.ApprovedYN != null ? Boolean(req.body.ApprovedYN) : null,
        FormName: req.body.FormName,
        RoleName: req.body.RoleName,
        UserID: parseInt(req.body.UserID) || 1
      };

      const result = await SalesRFQApprovalModel.updateSalesRFQApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update SalesRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesRFQId: null
      });
    }
  }

  static async deleteSalesRFQApproval(req, res) {
    try {
      const approvalData = {
        SalesRFQID: parseInt(req.body.SalesRFQID),
        ApproverID: parseInt(req.body.ApproverID),
        DeletedByID: parseInt(req.body.DeletedByID) || 1
      };

      const result = await SalesRFQApprovalModel.deleteSalesRFQApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete SalesRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesRFQId: null
      });
    }
  }

  static async getSalesRFQApproval(req, res) {
    try {
      const salesRFQId = parseInt(req.params.salesRFQId);
      const approverId = parseInt(req.params.approverId);
      if (isNaN(salesRFQId) || isNaN(approverId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesRFQID or ApproverID',
          data: null,
          salesRFQId: null
        });
      }

      const approvalData = {
        SalesRFQID: salesRFQId,
        ApproverID: approverId
      };

      const result = await SalesRFQApprovalModel.getSalesRFQApproval(approvalData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get SalesRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesRFQId: null
      });
    }
  }

  static async getAllSalesRFQApprovals(req, res) {
    try {
      const result = await SalesRFQApprovalModel.getAllSalesRFQApprovals();
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get All SalesRFQApprovals error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesRFQId: null
      });
    }
  }

  static async getPaginatedSalesRFQApprovals(req, res) {
    try {
      const salesRFQID = req.query.salesRFQID ? parseInt(req.query.salesRFQID) : null;
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      if (pageNumber < 1 || pageSize < 1) {
        return res.status(400).json({
          success: false,
          message: 'PageNumber and PageSize must be greater than or equal to 1',
          data: null,
          salesRFQId: salesRFQID
        });
      }

      const result = await SalesRFQApprovalModel.getPaginatedSalesRFQApprovals(salesRFQID, pageNumber, pageSize);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get Paginated SalesRFQApprovals error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesRFQId: null
      });
    }
  }
}

module.exports = SalesRFQApprovalController;