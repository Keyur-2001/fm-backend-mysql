const SalesQuotationApprovalModel = require('../models/salesQuotationApprovalModel');

class SalesQuotationApprovalController {
  static async createSalesQuotationApproval(req, res) {
    try {
      // Check if user has permission
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can create SalesQuotationApproval',
          data: null,
          salesQuotationId: null
        });
      }

      const approvalData = {
        SalesQuotationID: req.body.salesQuotationID ? parseInt(req.body.salesQuotationID) : null,
        ApproverID: parseInt(req.body.approverID) || req.user.personId,
        ApprovedYN: req.body.approvedYN != null ? Boolean(req.body.approvedYN) : null,
        ApproverDateTime: req.body.approverDateTime || null,
        CreatedByID: parseInt(req.body.createdByID) || req.user.personId
      };

      const result = await SalesQuotationApprovalModel.createSalesQuotationApproval(approvalData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Create SalesQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationId: null
      });
    }
  }

  static async getSalesQuotationApproval(req, res) {
    try {
      const salesQuotationId = parseInt(req.params.salesQuotationId);
      const approverId = parseInt(req.params.approverId);
      if (isNaN(salesQuotationId) || isNaN(approverId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SalesQuotationID or ApproverID',
          data: null,
          salesQuotationId: null
        });
      }

      const approvalData = {
        SalesQuotationID: salesQuotationId,
        ApproverID: approverId
      };

      const result = await SalesQuotationApprovalModel.getSalesQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get SalesQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationId: null
      });
    }
  }

  static async updateSalesQuotationApproval(req, res) {
    try {
      // Check if user has permission
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can update SalesQuotationApproval',
          data: null,
          salesQuotationId: null
        });
      }

      const approvalData = {
        SalesQuotationID: req.body.salesQuotationID ? parseInt(req.body.salesQuotationID) : null,
        ApproverID: parseInt(req.body.approverID) || req.user.personId,
        ApprovedYN: req.body.approvedYN != null ? Boolean(req.body.approvedYN) : null,
        ApproverDateTime: req.body.approverDateTime || null,
        CreatedByID: parseInt(req.body.createdByID) || req.user.personId
      };

      const result = await SalesQuotationApprovalModel.updateSalesQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update SalesQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationId: null
      });
    }
  }

  static async deleteSalesQuotationApproval(req, res) {
    try {
      // Check if user has permission
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can delete SalesQuotationApproval',
          data: null,
          salesQuotationId: null
        });
      }

      const approvalData = {
        SalesQuotationID: req.body.salesQuotationID ? parseInt(req.body.salesQuotationID) : null,
        ApproverID: parseInt(req.body.approverID) || req.user.personId,
        DeletedByID: parseInt(req.body.deletedByID) || req.user.personId
      };

      const result = await SalesQuotationApprovalModel.deleteSalesQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete SalesQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesQuotationId: null
      });
    }
  }
}

module.exports = SalesQuotationApprovalController;