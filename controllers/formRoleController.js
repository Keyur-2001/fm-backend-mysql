const FormRoleModel = require('../models/formRoleModel');

class FormRoleController {
<<<<<<< HEAD
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
=======
  static async getAllFormRoles(req, res) {
    try {
      const { pageNumber, pageSize } = req.query;

      const formRoles = await FormRoleModel.getAllFormRoles({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize)
      });

      return res.status(200).json({
        success: true,
        message: 'FormRoles retrieved successfully',
        data: formRoles.data,
        totalRecords: formRoles.totalRecords
      });
    } catch (err) {
      console.error('getAllFormRoles error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null
      });
    }
  }

  static async createFormRole(req, res) {
    try {
      const { formId, roleId, readOnly, writes } = req.body;

      if (!formId || !roleId || readOnly === undefined || writes === undefined) {
        return res.status(400).json({
          success: false,
          message: 'FormID, RoleID, ReadOnly, and Writes are required',
          data: null,
          formRoleId: null
        });
      }

      const result = await FormRoleModel.createFormRole({
        formId,
        roleId,
        readOnly,
        writes
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        formRoleId: result.formRoleId
      });
    } catch (err) {
      console.error('createFormRole error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null
      });
    }
  }

  static async getFormRoleById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid FormRoleID is required',
          data: null,
          formRoleId: null
        });
      }

      const formRole = await FormRoleModel.getFormRoleById(parseInt(id));

      if (!formRole) {
        return res.status(404).json({
          success: false,
          message: 'FormRole not found',
          data: null,
          formRoleId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'FormRole retrieved successfully',
        data: formRole,
        formRoleId: id
      });
    } catch (err) {
      console.error('getFormRoleById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null
      });
    }
  }

  static async updateFormRole(req, res) {
    try {
      const { id } = req.params;
      const { formId, roleId, readOnly, writes, createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid FormRoleID is required',
          data: null,
          formRoleId: null
        });
      }

      if (!formId || !roleId || readOnly === undefined || writes === undefined || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'FormID, RoleID, ReadOnly, Writes, and CreatedByID are required',
          data: null,
          formRoleId: id
        });
      }

      const result = await FormRoleModel.updateFormRole(parseInt(id), {
        formId,
        roleId,
        readOnly,
        writes,
        createdById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formRoleId: id
      });
    } catch (err) {
      console.error('updateFormRole error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null
      });
    }
  }

  static async deleteFormRole(req, res) {
    try {
      const { id } = req.params;
      const { createdById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid FormRoleID is required',
          data: null,
          formRoleId: null
        });
      }

      if (!createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedByID is required',
          data: null,
          formRoleId: id
        });
      }

      const result = await FormRoleModel.deleteFormRole(parseInt(id), createdById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formRoleId: id
      });
    } catch (err) {
      console.error('deleteFormRole error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formRoleId: null
      });
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }
}

<<<<<<< HEAD
module.exports = new FormRoleController();
=======
module.exports = FormRoleController;
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
