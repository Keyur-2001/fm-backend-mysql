<<<<<<< HEAD
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
=======
const poolPromise = require('../config/db.config');

class FormModel {
  static async getAllForms({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10
      ];

      console.log('getAllForms params:', queryParams);

      const [results] = await pool.query(
        'CALL SP_GetAllForms(?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllForms results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllForms output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllForms');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve Forms');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1] && results[1][0] ? results[1][0].TotalRecords : 0
      };
    } catch (err) {
      console.error('getAllForms error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async createForm(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_FormID
        data.formName,
        data.createdById,
        null, // p_IsDeleted
        null // p_DeletedByID
      ];

      console.log('createForm params:', queryParams);

      await pool.query(
        'CALL SP_ManageForm(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_FormID AS p_FormID');

      console.log('createForm output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageForm');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Form');
      }

      return {
        formId: output[0].p_FormID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createForm error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getFormById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_FormName
        null, // p_CreatedByID
        null, // p_IsDeleted
        null // p_DeletedByID
      ];

      console.log('getFormById params:', queryParams);

      const [results] = await pool.query(
        'CALL SP_ManageForm(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getFormById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getFormById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageForm');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Form not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getFormById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateForm(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.formName,
        data.createdById,
        data.isDeleted,
        data.deletedById
      ];

      console.log('updateForm params:', queryParams);

      await pool.query(
        'CALL SP_ManageForm(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updateForm output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageForm');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Form');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateForm error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async deleteForm(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_FormName
        null, // p_CreatedByID
        null, // p_IsDeleted
        deletedById
      ];

      console.log('deleteForm params:', queryParams);

      await pool.query(
        'CALL SP_ManageForm(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deleteForm output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageForm');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Form');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteForm error:', err);
      throw new Error(`Database error: ${err.message}`);
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }
}

module.exports = FormModel;