const FormRoleModel = require('../models/formRoleModel');

class FormRoleController {
  // Get all FormRoles
  static async getAllFormRoles(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate, formId, roleId, createdBy } = req.query;
      if (!pageNumber || !pageSize) {
        return res.status(400).json({
          success: false,
          message: 'pageNumber and pageSize are required.',
          data: null,
          totalRecords: 0
        });
      }

      const result = await FormRoleModel.getAllFormRoles({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        fromDate,
        toDate,
        formId: formId ? parseInt(formId) : undefined,
        roleId: roleId ? parseInt(roleId) : undefined,
        createdBy
      });

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.data,
        totalRecords: result.totalRecords
      });
    } catch (err) {
      console.error('Error in getAllFormRoles:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  // Create a new FormRole
  static async createFormRole(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.formId || !data.roleId || data.createdById === undefined) {
        return res.status(400).json({
          success: false,
          message: 'FormID, RoleID, and CreatedById are required.',
          data: null,
          formRoleId: null,
          newFormRoleId: null
        });
      }

      const result = await FormRoleModel.createFormRole(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        formRoleId: null,
        newFormRoleId: result.newFormRoleId
      });
    } catch (err) {
      console.error('Error in createFormRole:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null,
        newFormRoleId: null
      });
    }
  }

  // Get a single FormRole by ID
  static async getFormRoleById(req, res) {
    try {
      const { id } = req.params;
      const formRole = await FormRoleModel.getFormRoleById(parseInt(id));
      if (!formRole) {
        return res.status(404).json({
          success: false,
          message: 'FormRole not found.',
          data: null,
          formRoleId: null,
          newFormRoleId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'FormRole retrieved successfully.',
        data: formRole,
        formRoleId: id,
        newFormRoleId: null
      });
    } catch (err) {
      console.error('Error in getFormRoleById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null,
        newFormRoleId: null
      });
    }
  }

  // Update a FormRole
  static async updateFormRole(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.formId || !data.roleId || data.createdById === undefined) {
        return res.status(400).json({
          success: false,
          message: 'FormID, RoleID, and CreatedById are required.',
          data: null,
          formRoleId: null,
          newFormRoleId: null
        });
      }

      const result = await FormRoleModel.updateFormRole(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formRoleId: id,
        newFormRoleId: null
      });
    } catch (err) {
      console.error('Error in updateFormRole:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null,
        newFormRoleId: null
      });
    }
  }

  // Delete a FormRole
  static async deleteFormRole(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;
      if (createdById === undefined) {
        return res.status(400).json({
          success: false,
          message: 'CreatedById is required.',
          data: null,
          formRoleId: null,
          newFormRoleId: null
        });
      }

      const result = await FormRoleModel.deleteFormRole(parseInt(id), createdById);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formRoleId: id,
        newFormRoleId: null
      });
    } catch (err) {
      console.error('Error in deleteFormRole:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null,
        newFormRoleId: null
      });
    }
  }
}

module.exports = FormRoleController;
