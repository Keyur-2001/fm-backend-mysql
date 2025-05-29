const SupplierQuotationApprovalModel = require('../models/supplierQuotationApprovalModel');

class SupplierQuotationApprovalController {
  static async createSupplierQuotationApproval(req, res) {
    try {
      const approvalData = {
        SupplierQuotationID: parseInt(req.body.SupplierQuotationID),
        ApproverID: parseInt(req.body.ApproverID),
        ApprovedYN: req.body.ApprovedYN != null ? Boolean(req.body.ApprovedYN) : null,
        FormName: req.body.FormName || 'SupplierQuotation',
        RoleName: req.body.RoleName || 'Approver',
        UserID: parseInt(req.body.UserID) || 1,
        CreatedByID: parseInt(req.body.CreatedByID) || parseInt(req.body.ApproverID) || 1
      };

      const result = await SupplierQuotationApprovalModel.createSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Create SupplierQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        supplierQuotationId: null
      });
    }
  }

  static async updateSupplierQuotationApproval(req, res) {
    try {
      const [supplierQuotationId, approverId] = req.params.id.split('_').map(id => parseInt(id));
      if (isNaN(supplierQuotationId) || isNaN(approverId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SupplierQuotationID or ApproverID in ID format (e.g., 123_456)',
          data: null,
          supplierQuotationId: null
        });
      }

      const approvalData = {
        SupplierQuotationID: supplierQuotationId,
        ApproverID: approverId,
        ApprovedYN: req.body.ApprovedYN != null ? Boolean(req.body.ApprovedYN) : null,
        FormName: req.body.FormName || 'SupplierQuotation',
        RoleName: req.body.RoleName || 'Approver',
        UserID: parseInt(req.body.UserID) || 1
      };

      const result = await SupplierQuotationApprovalModel.updateSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update SupplierQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        supplierQuotationId: null
      });
    }
  }

  static async deleteSupplierQuotationApproval(req, res) {
    try {
      const [supplierQuotationId, approverId] = req.params.id.split('_').map(id => parseInt(id));
      if (isNaN(supplierQuotationId) || isNaN(approverId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SupplierQuotationID or ApproverID in ID format (e.g., 123_456)',
          data: null,
          supplierQuotationId: null
        });
      }

      const approvalData = {
        SupplierQuotationID: supplierQuotationId,
        ApproverID: approverId,
        DeletedByID: parseInt(req.body.DeletedByID) || 1
      };

      const result = await SupplierQuotationApprovalModel.deleteSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete SupplierQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        supplierQuotationId: null
      });
    }
  }

  static async getSupplierQuotationApproval(req, res) {
    try {
      const [supplierQuotationId, approverId] = req.params.id.split('_').map(id => parseInt(id));
      if (isNaN(supplierQuotationId) || isNaN(approverId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SupplierQuotationID or ApproverID in ID format (e.g., 123_456)',
          data: null,
          supplierQuotationId: null
        });
      }

      const approvalData = {
        SupplierQuotationID: supplierQuotationId,
        ApproverID: approverId,
        FormName: req.query.FormName || 'SupplierQuotation',
        RoleName: req.query.RoleName || 'Approver',
        UserID: parseInt(req.query.UserID) || 1
      };

      const result = await SupplierQuotationApprovalModel.getSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get SupplierQuotationApproval error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        supplierQuotationId: null
      });
    }
  }

  static async getAllSupplierQuotationApprovals(req, res) {
    try {
      const approvalData = {
        SupplierQuotationID: req.query.SupplierQuotationID ? parseInt(req.query.SupplierQuotationID) : null,
        FormName: req.query.FormName || 'SupplierQuotation',
        RoleName: req.query.RoleName || 'Approver',
        UserID: parseInt(req.query.UserID) || 1
      };

      const result = await SupplierQuotationApprovalModel.getAllSupplierQuotationApprovals(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Get All SupplierQuotationApprovals error:', error);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        supplierQuotationId: null
      });
    }
  }
}

module.exports = SupplierQuotationApprovalController;