const FormModel = require('../models/formModel');

class FormController {
  static async createForm(req, res) {
    try {
      if (!req.user || !req.user.personId) {
        return res.status(401).json({ success: false, message: 'Authenticated user ID required', data: null });
      }

      const formData = req.body;
      formData.CreatedByID = parseInt(req.user.personId);
      const result = await FormModel.createForm(formData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error('Create Form error:', error);
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async updateForm(req, res) {
    try {
      if (!req.user || !req.user.personId) {
        return res.status(401).json({ success: false, message: 'Authenticated user ID required', data: null });
      }

      const formData = req.body;
      formData.FormID = parseInt(req.params.id);
      if (isNaN(formData.FormID)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing FormID', data: null });
      }
      formData.CreatedByID = parseInt(req.user.personId);
      const result = await FormModel.updateForm(formData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Update Form error:', error);
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async deleteForm(req, res) {
    try {
      if (!req.user || !req.user.personId) {
        return res.status(401).json({ success: false, message: 'Authenticated user ID required', data: null });
      }

      const formData = {
        FormID: parseInt(req.params.id),
        DeletedByID: parseInt(req.user.personId)
      };
      if (isNaN(formData.FormID)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing FormID', data: null });
      }
      const result = await FormModel.deleteForm(formData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Delete Form error:', error);
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async getForm(req, res) {
    try {
      const formData = {
        FormID: parseInt(req.params.id)
      };
      if (isNaN(formData.FormID)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing FormID', data: null });
      }
      const result = await FormModel.getForm(formData);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get Form error:', error);
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }

  static async getAllForms(req, res) {
    try {
      const { pageNumber, pageSize } = req.query;
      const pageNum = parseInt(pageNumber) || 1;
      const pageSz = parseInt(pageSize) || 10;

      // Validate pagination parameters
      if (pageNum <= 0 || pageSz <= 0) {
        return res.status(400).json({
          success: false,
          message: 'PageNumber and PageSize must be greater than 0',
          data: null
        });
      }

      const result = await FormModel.getAllForms(pageNum, pageSz);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error('Get all Forms error:', error);
      return res.status(500).json({ success: false, message: `Server error: ${error.message}`, data: null });
    }
  }
}

module.exports = FormController;