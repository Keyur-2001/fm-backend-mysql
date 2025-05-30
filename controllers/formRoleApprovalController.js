const FormRoleApproverModel = require('../models/formRoleApprovalModel');

class FormRoleApproverController {
  async getAllFormRoleApprovers(req, res) {
    try {
      const params = {
        PageNumber: parseInt(req.query.pageNumber) || 1,
        PageSize: parseInt(req.query.pageSize) || 10,
        FormRoleID: parseInt(req.query.formRoleId) || null,
        UserID: parseInt(req.query.userId) || null,
        ActiveOnly: req.query.activeOnly !== undefined ? req.query.activeOnly === 'true' : null,
        CreatedBy: req.user?.username || null // Assuming user info from auth middleware
      };

      const result = await FormRoleApproverModel.getAllFormRoleApprovers(params);
      
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

  async createFormRoleApprover(req, res) {
    try {
      const formRoleApprover = {
        FormRoleID: req.body.FormRoleID,
        UserID: req.body.UserID,
        ActiveYN: req.body.ActiveYN,
        CreatedByID: req.user?.id || 1 // Assuming user ID from auth middleware
      };

      const result = await FormRoleApproverModel.create(formRoleApprover);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(201).json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateFormRoleApprover(req, res) {
    try {
      const formRoleApprover = {
        FormRoleApproverID: req.params.id,
        FormRoleID: req.body.FormRoleID,
        UserID: req.body.UserID,
        ActiveYN: req.body.ActiveYN,
        CreatedByID: req.user?.id || 1
      };

      const result = await FormRoleApproverModel.update(formRoleApprover);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteFormRoleApprover(req, res) {
    try {
      const formRoleApproverID = req.params.id;
      const createdByID = req.user?.id || 1;

      const result = await FormRoleApproverModel.delete(formRoleApproverID, createdByID);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFormRoleApprover(req, res) {
    try {
      const formRoleApproverID = req.params.id;
      const result = await FormRoleApproverModel.getById(formRoleApproverID);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: result.message, data: result.data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new FormRoleApproverController();