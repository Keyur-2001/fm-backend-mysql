const poolPromise = require('../config/db.config');

class FormModel {
  // Get paginated Forms
  static async getAllForms({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Log query parameters
      console.log('getAllForms params:', queryParams);

      // Call SP_GetAllForm
      const [results] = await pool.query(
        'CALL SP_GetAllForm(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAllForms results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getAllForms output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllForm');
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to retrieve forms');
      }

      // Calculate total records (since SP_GetAllForm doesn't provide it)
      const [countResult] = await pool.query(
        `SELECT COUNT(*) AS totalRecords 
         FROM dbo_tblform f 
         WHERE (f.IsDeleted IS NULL OR f.IsDeleted = 0)
           AND (? IS NULL OR f.CreatedDateTime >= ?)
           AND (? IS NULL OR f.CreatedDateTime <= ?)`,
        [fromDate, fromDate, toDate, toDate]
      );

      return {
        data: results[0] || [],
        totalRecords: countResult[0].totalRecords || 0
      };
    } catch (err) {
      console.error('getAllForms error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Form
  static async createForm(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_FormID
        data.formName,
        data.createdById,
        null, // p_IsDeleted
        null  // p_DeletedByID
      ];

      // Log query parameters
      console.log('createForm params:', queryParams);

      // Call sp_manageform
      const [results] = await pool.query(
        'CALL sp_manageform(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('createForm results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('createForm output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from sp_manageform');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Form');
      }

      // Extract formId from the message (since sp_manageform returns it in p_Message)
      const formIdMatch = output[0].p_Message.match(/ID: (\d+)/);
      const formId = formIdMatch ? parseInt(formIdMatch[1]) : null;

      return {
        formId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createForm error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Form by ID
  static async getFormById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_FormName
        null, // p_CreatedByID
        null, // p_IsDeleted
        null  // p_DeletedByID
      ];

      // Log query parameters
      console.log('getFormById params:', queryParams);

      // Call sp_manageform
      const [results] = await pool.query(
        'CALL sp_manageform(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getFormById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getFormById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from sp_manageform');
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

  // Update a Form
  static async updateForm(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.formName,
        null, // p_CreatedByID (not updated)
        data.isDeleted ? 1 : 0,
        data.deletedById
      ];

      // Log query parameters
      console.log('updateForm params:', queryParams);

      // Call sp_manageform
      const [results] = await pool.query(
        'CALL sp_manageform(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('updateForm results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateForm output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from sp_manageform');
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

  // Delete a Form
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

      // Log query parameters
      console.log('deleteForm params:', queryParams);

      // Call sp_manageform
      const [results] = await pool.query(
        'CALL sp_manageform(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('deleteForm results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deleteForm output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from sp_manageform');
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
    }
  }
}

module.exports = FormModel;