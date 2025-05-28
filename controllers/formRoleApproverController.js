const FormRoleApproverModel = require('../models/formRoleApproverModel');

class FormRoleApproverController {
  // Get all FormRoleApprovers
  static async getAllFormRoleApprovers(req, res) {
    try {
      const { pageNumber, pageSize } = req.query;
      const result = await FormRoleApproverModel.getAllFormRoleApprovers({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10
      });
      res.status(200).json({
        success: true,
        message: 'FormRoleApprover records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        formRoleApproverId: null,
        newFormRoleApproverId: null
      });
    } catch (err) {
      console.error('Error in getAllFormRoleApprovers:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleApproverId: null,
        newFormRoleApproverId: null
      });
    }
  }

  // Create a new FormRoleApprover
  static async createFormRoleApprover(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.formRoleId || !data.userId || data.createdById === undefined) {
        return res.status(400).json({
          success: false,
          message: 'FormRoleID, UserID, and CreatedById are required.',
          data: null,
          formRoleApproverId: null,
          newFormRoleApproverId: null
        });
      }

      const result = await FormRoleApproverModel.createFormRoleApprover(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        formRoleApproverId: null,
        newFormRoleApproverId: result.newFormRoleApproverId
      });
    } catch (err) {
      console.error('Error in createFormRoleApprover:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleApproverId: null,
        newFormRoleApproverId: null
      });
    }
  }

  // Get a single FormRoleApprover by ID
  static async getFormRoleApproverById(req, res) {
    try {
      const { id } = req.params;
      const formRoleApprover = await FormRoleApproverModel.getFormRoleApproverById(parseInt(id));
      if (!formRoleApprover) {
        return res.status(404).json({
          success: false,
          message: 'FormRoleApprover not found.',
          data: null,
          formRoleApproverId: null,
          newFormRoleApproverId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'FormRoleApprover retrieved successfully.',
        data: formRoleApprover,
        formRoleApproverId: id,
        newFormRoleApproverId: null
      });
    } catch (err) {
      console.error('Error in getFormRoleApproverById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleApproverId: null,
        newFormRoleApproverId: null
      });
    }
  }

  // Update a FormRoleApprover
  static async updateFormRoleApprover(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.formRoleId || !data.userId || data.createdById === undefined) {
        return res.status(400).json({
          success: false,
          message: 'FormRoleID, UserID, and CreatedById are required.',
          data: null,
          formRoleApproverId: null,
          newFormRoleApproverId: null
        });
      }

      const result = await FormRoleApproverModel.updateFormRoleApprover(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formRoleApproverId: id,
        newFormRoleApproverId: null
      });
    } catch (err) {
      console.error('Error in updateFormRoleApprover:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleApproverId: null,
        newFormRoleApproverId: null
      });
    }
  }

  // Delete a FormRoleApprover
  static async deleteFormRoleApprover(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;
      if (createdById === undefined) {
        return res.status(400).json({
          success: false,
          message: 'CreatedById is required.',
          data: null,
          formRoleApproverId: null,
          newFormRoleApproverId: null
        });
      }

      const result = await FormRoleApproverModel.deleteFormRoleApprover(parseInt(id), createdById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formRoleApproverId: id,
        newFormRoleApproverId: null
      });
    } catch (err) {
      console.error('Error in deleteFormRoleApprover:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleApproverId: null,
        newFormRoleApproverId: null
      });
    }
  }
}

module.exports = FormRoleApproverController;