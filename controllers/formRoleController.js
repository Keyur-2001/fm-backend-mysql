const FormRoleModel = require('../models/formRoleModel');

class FormRoleController {
  async getAllFormRoles(req, res) {
    try {
      const params = {
        PageNumber: parseInt(req.query.pageNumber) || 1,
        PageSize: parseInt(req.query.pageSize) || 10,
        FromDate: req.query.fromDate || null,
        ToDate: req.query.toDate || null,
        FormID: parseInt(req.query.formId) || null,
        RoleID: parseInt(req.query.roleId) || null,
        DateField: req.query.dateField || 'CreatedDateTime',
        CreatedBy: req.user?.username || null // Assuming user info from auth middleware
      };

      const result = await FormRoleModel.getAllFormRoles(params);
      
      res.json({
        success: true,
        data: result.data,
        pagination: {
          totalRecords: result.totalRecords,
          pageNumber: result.pageNumber,
          pageSize: result.pageSize,
          totalPages: Math.ceil(result.totalRecords / result.pageSize)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  async createFormRole(req, res) {
    try {
      const formRole = {
        FormID: req.body.FormID,
        RoleID: req.body.RoleID,
        ReadOnly: req.body.ReadOnly,
        Write: req.body.Write,
        CreatedByID: req.user?.id || 1, // Assuming user ID comes from auth middleware
      };

      const result = await FormRoleModel.create(formRole);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(201).json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateFormRole(req, res) {
    try {
      const formRole = {
        FormRoleID: req.params.id,
        FormID: req.body.FormID,
        RoleID: req.body.RoleID,
        ReadOnly: req.body.ReadOnly,
        Write: req.body.Write,
        CreatedByID: req.user?.id || 1,
      };

      const result = await FormRoleModel.update(formRole);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteFormRole(req, res) {
    try {
      const formRoleID = req.params.id;
      const createdByID = req.user?.id || 1;

      const result = await FormRoleModel.delete(formRoleID, createdByID);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFormRole(req, res) {
    try {
      const formRoleID = req.params.id;
      const result = await FormRoleModel.getById(formRoleID);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new FormRoleController();