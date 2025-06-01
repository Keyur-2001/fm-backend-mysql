const SupplierQuotationApprovalModel = require('../models/supplierQuotationApprovalModel');

class SupplierQuotationApprovalController {
  // Get Supplier Quotation approvals (all or filtered by SupplierQuotationID)
  static async getSupplierQuotationApprovals(req, res) {
    try {
      const { supplierQuotationID, pageNumber, pageSize } = req.query;

      if (supplierQuotationID && isNaN(parseInt(supplierQuotationID))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SupplierQuotationID',
          data: null,
          supplierQuotationId: null,
          totalRecords: 0
        });
      }

      const result = await SupplierQuotationApprovalModel.getSupplierQuotationApprovals({
        supplierQuotationID: supplierQuotationID ? parseInt(supplierQuotationID) : null,
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in getSupplierQuotationApprovals:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
        totalRecords: 0
      });
    }
  }

  // Get a specific Supplier Quotation approval by SupplierQuotationID and ApproverID
  static async getSupplierQuotationApprovalById(req, res) {
    try {
      const { supplierQuotationID, approverID } = req.params;

      if (isNaN(parseInt(supplierQuotationID)) || isNaN(parseInt(approverID))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing SupplierQuotationID or ApproverID',
          data: null,
          supplierQuotationId: null,
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          supplierQuotationId: null,
        });
      }

      const result = await SupplierQuotationApprovalModel.getSupplierQuotationApprovalById({
        supplierQuotationID: parseInt(supplierQuotationID),
        approverID: parseInt(approverID)
      });

      return res.status(result.success ? (result.data ? 200 : 404) : 400).json(result);
    } catch (err) {
      console.error('Error in getSupplierQuotationApprovalById:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
      });
    }
  }

  // Create a Supplier Quotation approval
  static async createSupplierQuotationApproval(req, res) {
    try {
      const { supplierQuotationID, approvedYN, formName, roleName } = req.body;
      const approverID = req.user?.personId;

      if (!supplierQuotationID || !formName || !roleName) {
        return res.status(400).json({
          success: false,
          message: 'supplierQuotationID, formName, and roleName are required',
          data: null,
          supplierQuotationId: null,
        });
      }

      if (!req.user || !approverID) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          supplierQuotationId: null,
        });
      }

      const approvalData = {
        SupplierQuotationID: parseInt(supplierQuotationID),
        ApproverID: parseInt(approverID),
        ApprovedYN: approvedYN != null ? Boolean(approvedYN) : null,
        FormName: formName,
        RoleName: roleName,
        CreatedByID: parseInt(approverID)
      };

      const result = await SupplierQuotationApprovalModel.createSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
      console.error('Error in createSupplierQuotationApproval:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
      });
    }
  }

  // Update a Supplier Quotation approval
  static async updateSupplierQuotationApproval(req, res) {
    try {
      const { supplierQuotationID, approvedYN, formName, roleName } = req.body;
      const approverID = req.user?.personId;

      if (!supplierQuotationID || !formName || !roleName) {
        return res.status(400).json({
          success: false,
          message: 'supplierQuotationID, formName, and roleName are required',
          data: null,
          supplierQuotationId: null,
        });
      }

      if (!req.user || !approverID) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          supplierQuotationId: null,
        });
      }

      const approvalData = {
        SupplierQuotationID: parseInt(supplierQuotationID),
        ApproverID: parseInt(approverID),
        ApprovedYN: approvedYN != null ? Boolean(approvedYN) : null,
        FormName: formName,
        RoleName: roleName
      };

      const result = await SupplierQuotationApprovalModel.updateSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in updateSupplierQuotationApproval:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
      });
    }
  }

  // Delete a Supplier Quotation approval
  static async deleteSupplierQuotationApproval(req, res) {
    try {
      const { supplierQuotationID } = req.body;
      const approverID = req.user?.personId;

      if (!supplierQuotationID) {
        return res.status(400).json({
          success: false,
          message: 'supplierQuotationID is required',
          data: null,
          supplierQuotationId: null,
        });
      }

      if (!req.user || !approverID) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          data: null,
          supplierQuotationId: null,
        });
      }

      const approvalData = {
        SupplierQuotationID: parseInt(supplierQuotationID),
        ApproverID: parseInt(approverID),
        DeletedByID: parseInt(approverID)
      };

      const result = await SupplierQuotationApprovalModel.deleteSupplierQuotationApproval(approvalData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error('Error in deleteSupplierQuotationApproval:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        supplierQuotationId: null,
      });
    }
  }
}

module.exports = SupplierQuotationApprovalController;