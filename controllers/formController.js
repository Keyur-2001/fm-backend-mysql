const FormModel = require('../models/formModel');

class FormController {
<<<<<<< HEAD
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
=======
  static async getAllForms(req, res) {
    try {
      const { pageNumber, pageSize } = req.query;

      const forms = await FormModel.getAllForms({
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize)
      });

      return res.status(200).json({
        success: true,
        message: 'Forms retrieved successfully',
        data: forms.data,
        totalRecords: forms.totalRecords
      });
    } catch (err) {
      console.error('getAllForms error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formId: null
      });
    }
  }

  static async createForm(req, res) {
    try {
      const { formName, createdById } = req.body;

      if (!formName || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'FormName and CreatedByID are required',
          data: null,
          formId: null
        });
      }

      const result = await FormModel.createForm({
        formName,
        createdById
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        formId: result.formId
      });
    } catch (err) {
      console.error('createForm error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formId: null
      });
    }
  }

  static async getFormById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid FormID is required',
          data: null,
          formId: null
        });
      }

      const form = await FormModel.getFormById(parseInt(id));

      if (!form) {
        return res.status(404).json({
          success: false,
          message: 'Form not found',
          data: null,
          formId: id
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Form retrieved successfully',
        data: form,
        formId: id
      });
    } catch (err) {
      console.error('getFormById error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formId: null
      });
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }

  static async updateForm(req, res) {
    try {
<<<<<<< HEAD
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
=======
      const { id } = req.params;
      const { formName, isDeleted, createdById, deletedById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid FormID is required',
          data: null,
          formId: null
        });
      }

      if (!formName || !createdById) {
        return res.status(400).json({
          success: false,
          message: 'FormName and CreatedByID are required',
          data: null,
          formId: id
        });
      }

      if (isDeleted && !deletedById) {
        return res.status(400).json({
          success: false,
          message: 'DeletedByID is required when IsDeleted is true',
          data: null,
          formId: id
        });
      }

      const result = await FormModel.updateForm(parseInt(id), {
        formName,
        isDeleted,
        createdById,
        deletedById
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formId: id
      });
    } catch (err) {
      console.error('updateForm error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formId: null
      });
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }

  static async deleteForm(req, res) {
    try {
<<<<<<< HEAD
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
=======
      const { id } = req.params;
      const { deletedById } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Valid FormID is required',
          data: null,
          formId: null
        });
      }

      if (!deletedById) {
        return res.status(400).json({
          success: false,
          message: 'DeletedByID is required',
          data: null,
          formId: id
        });
      }

      const result = await FormModel.deleteForm(parseInt(id), deletedById);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        formId: id
      });
    } catch (err) {
      console.error('deleteForm error:', err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        formId: null
      });
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }
}

module.exports = FormController;