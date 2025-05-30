const sql = require('mssql');
const poolPromise = require('../config/db.config');

class FormModel {
  static async #validatePersonID(personID, fieldName) {
    if (!personID || isNaN(parseInt(personID))) {
      return { valid: false, message: `${fieldName} must be a valid integer` };
    }
    const pool = await poolPromise;
    const result = await pool.request()
      .input('PersonID', sql.Int, parseInt(personID))
      .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @PersonID AND IsDeleted = 0');
    if (result.recordset.length === 0) {
      return { valid: false, message: `${fieldName} ${personID} does not exist in tblPerson` };
    }
    return { valid: true };
  }

  static async #executeStoredProcedure(action, formData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (formData.FormID) request.input('FormID', sql.Int, formData.FormID);
      if (formData.FormName) request.input('FormName', sql.NVarChar(50), formData.FormName);
      if (formData.CreatedByID) request.input('CreatedByID', sql.Int, formData.CreatedByID);
      if (formData.IsDeleted !== undefined) request.input('IsDeleted', sql.Bit, formData.IsDeleted);
      if (formData.DeletedByID) request.input('DeletedByID', sql.Int, formData.DeletedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageForm');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: action === 'SELECT' ? (formData.FormID ? result.recordset?.[0] || null : result.recordset || []) : null,
        formId: action === 'INSERT' ? result.recordset?.[0]?.FormID || formData.FormID || null : formData.FormID
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async createForm(formData) {
    // Validate required fields
    const requiredFields = ['FormName', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => !formData[field] || (field === 'FormName' && formData[field].trim().length === 0));

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null
      };
    }

    // Validate CreatedByID
    const personValidation = await this.#validatePersonID(formData.CreatedByID, 'CreatedByID');
    if (!personValidation.valid) {
      return {
        success: false,
        message: personValidation.message,
        data: null
      };
    }

    return await this.#executeStoredProcedure('INSERT', formData);
  }

  static async updateForm(formData) {
    // Validate required fields
    if (!formData.FormID) {
      return {
        success: false,
        message: 'FormID is required for update',
        data: null
      };
    }

    // Validate CreatedByID
    const personValidation = await this.#validatePersonID(formData.CreatedByID, 'CreatedByID');
    if (!personValidation.valid) {
      return {
        success: false,
        message: personValidation.message,
        data: null
      };
    }

    return await this.#executeStoredProcedure('UPDATE', formData);
  }

  static async deleteForm(formData) {
    // Validate required fields
    if (!formData.FormID || !formData.DeletedByID) {
      return {
        success: false,
        message: `${!formData.FormID ? 'FormID' : ''}${!formData.FormID && !formData.DeletedByID ? ', ' : ''}${!formData.DeletedByID ? 'DeletedByID' : ''} are required`,
        data: null
      };
    }

    // Validate DeletedByID
    const personValidation = await this.#validatePersonID(formData.DeletedByID, 'DeletedByID');
    if (!personValidation.valid) {
      return {
        success: false,
        message: personValidation.message,
        data: null
      };
    }

    return await this.#executeStoredProcedure('DELETE', formData);
  }

  static async getForm(formData) {
    // Validate required fields
    if (!formData.FormID) {
      return {
        success: false,
        message: 'FormID is required for retrieval',
        data: null
      };
    }

    return await this.#executeStoredProcedure('SELECT', formData);
  }

  static async getAllForms(pageNumber = 1, pageSize = 10) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('PageNumber', sql.Int, pageNumber);
      request.input('PageSize', sql.Int, pageSize);

      // Output parameter
      request.output('TotalCount', sql.Int);

      const result = await request.execute('SP_GetAllForms');

      return {
        success: true,
        message: 'Forms retrieved successfully.',
        data: result.recordset || [],
        totalCount: result.output.TotalCount || 0,
        pageNumber,
        pageSize
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = FormModel;