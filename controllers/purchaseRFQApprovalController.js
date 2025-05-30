const PurchaseRFQApprovalModel = require('../models/purchaseRFQApprovalModel');

class PurchaseRFQApprovalController {
  static async createPurchaseRFQApproval(req, res) {
    try {
      // Check if user has permission to create PurchaseRFQApproval
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can create PurchaseRFQApproval',
          data: null,
          purchaseRFQId: null
        });
      }

      const approvalData = {
        PurchaseRFQID: req.body.purchaseRFQID ? parseInt(req.body.purchaseRFQID) : null,
        ApproverID: parseInt(req.body.approverID) || req.user.personId, // Use authenticated user's personId
        ApprovedYN: req.body.approvedYN != null ? Boolean(req.body.approvedYN) : null,
        ApproverDateTime: req.body.approverDateTime || null
      };

      const result = await PurchaseRFQApprovalModel.createPurchaseRFQApproval(approvalData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Create PurchaseRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        purchaseRFQId: null
      });
    }
  }

  static async getPurchaseRFQApproval(req, res) {
    try {
      const purchaseRFQId = parseInt(req.params.purchaseRFQId);
      const approverId = parseInt(req.params.approverId);
      if (isNaN(purchaseRFQId) || isNaN(approverId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing PurchaseRFQID or ApproverID',
          data: null,
          purchaseRFQId: null
        });
      }

      const approvalData = {
        PurchaseRFQID: purchaseRFQId,
        ApproverID: approverId
      };

      const result = await PurchaseRFQApprovalModel.getPurchaseRFQApproval(approvalData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get PurchaseRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        purchaseRFQId: null
      });
    }
  }

  static async updatePurchaseRFQApproval(req, res) {
    try {
      // Check if user has permission to update PurchaseRFQApproval
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can update PurchaseRFQApproval',
          data: null,
          purchaseRFQId: null
        });
      }

      const approvalData = {
        PurchaseRFQID: req.body.purchaseRFQID ? parseInt(req.body.purchaseRFQID) : null,
        ApproverID: parseInt(req.body.approverID) || req.user.personId, // Use authenticated user's personId
        ApprovedYN: req.body.approvedYN != null ? Boolean(req.body.approvedYN) : null,
        ApproverDateTime: req.body.approverDateTime || null
      };

      const result = await PurchaseRFQApprovalModel.updatePurchaseRFQApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update PurchaseRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        purchaseRFQId: null
      });
    }
  }

  static async deletePurchaseRFQApproval(req, res) {
    try {
      // Check if user has permission to delete PurchaseRFQApproval
      const allowedRoles = ['Administrator', 'Customer Order Coordinator'];
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only Administrators or Customer Order Coordinators can delete PurchaseRFQApproval',
          data: null,
          purchaseRFQId: null
        });
      }

      const approvalData = {
        PurchaseRFQID: req.body.purchaseRFQID ? parseInt(req.body.purchaseRFQID) : null,
        ApproverID: parseInt(req.body.approverID) || req.user.personId // Use authenticated user's personId
      };

      const result = await PurchaseRFQApprovalModel.deletePurchaseRFQApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete PurchaseRFQApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        purchaseRFQId: null
      });
    }
  }

  static async getAllPurchaseRFQApprovals(req, res) {
    try {
      const result = await PurchaseRFQApprovalModel.getAllPurchaseRFQApprovals();
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get All PurchaseRFQApprovals error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        purchaseRFQId: null
      });
    }
  }

  static async getPaginatedPurchaseRFQApprovals(req, res) {
    try {
      const paginationData = {
        PurchaseRFQID: req.query.purchaseRFQID ? parseInt(req.query.purchaseRFQID) : null,
        ApproverID: req.query.approverID ? parseInt(req.query.approverID) : null,
        ApprovedYN: req.query.approvedYN != null ? Boolean(req.query.approvedYN) : null,
        PageNumber: parseInt(req.query.pageNumber) || 1,
        PageSize: parseInt(req.query.pageSize) || 10,
        SortColumn: req.query.sortColumn || 'PurchaseRFQID',
        SortDirection: req.query.sortDirection && ['ASC', 'DESC'].includes(req.query.sortDirection.toUpperCase()) ? req.query.sortDirection.toUpperCase() : 'ASC'
      };

      if (paginationData.PageNumber < 1 || paginationData.PageSize < 1) {
        return res.status(400).json({
          success: false,
          message: 'PageNumber and PageSize must be greater than or equal to 1',
          data: null,
          purchaseRFQId: paginationData.PurchaseRFQID
        });
      }

      const result = await PurchaseRFQApprovalModel.getPaginatedPurchaseRFQApprovals(paginationData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get Paginated PurchaseRFQApprovals error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        purchaseRFQId: null
      });
    }
  }
}

module.exports = PurchaseRFQApprovalController;