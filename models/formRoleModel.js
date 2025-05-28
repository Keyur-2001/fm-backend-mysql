const poolPromise = require('../config/db.config');

class FormRoleModel {
  // Get paginated FormRoles
  static async getAllFormRoles({ pageNumber = 1, pageSize = 10, fromDate, toDate, formId, roleId, createdBy }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate || null,
        toDate || null,
        formId || null,
        roleId || null,
        createdBy || null
      ];

      // Call SP_GetAllFormRoles
      const [result] = await pool.query(
        'CALL SP_GetAllFormRoles(?, ?, ?, ?, ?, ?, ?, @p_TotalRecords)',
        queryParams
      );

      // Retrieve OUT parameter
      const [[outParams]] = await pool.query('SELECT @p_TotalRecords AS totalRecords');

      return {
        success: outParams.totalRecords !== -1,
        message: outParams.totalRecords !== -1 ? 'FormRoles fetched successfully.' : 'Error fetching FormRoles.',
        data: result[0] || [],
        totalRecords: outParams.totalRecords !== -1 ? outParams.totalRecords : 0
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new FormRole
  static async createFormRole(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_FormRoleID
        data.formId,
        data.roleId,
        data.readOnly || 0,
        data.writeOnly || 0, 
        data.createdById
      ];

      // Call SP_ManageFormRole
      const [result] = await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters and new FormRoleID
      const [[outParams]] = await pool.query('SELECT @p_Result AS result, @p_Message AS message');
      const newFormRoleId = result[0] && result[0][0] ? result[0][0].FormRoleID : null;

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create FormRole');
      }

      return {
        newFormRoleId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single FormRole by ID
  static async getFormRoleById(id) {
    try {
      const pool = await poolPromise;

      // Call SP_ManageFormRole
      const [result] = await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        ['SELECT', id, null, null, null, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query('SELECT @p_Result AS result, @p_Message AS message');

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'FormRole not found');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a FormRole
  static async updateFormRole(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.formId,
        data.roleId,
        data.readOnly || 0,
        data.writeOnly || 0,
        data.createdById
      ];

      // Call SP_ManageFormRole
      await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query('SELECT @p_Result AS result, @p_Message AS message');

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update FormRole');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a FormRole
  static async deleteFormRole(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null,
        null,
        null,
        null,
        createdById
      ];

      // Call SP_ManageFormRole
      await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query('SELECT @p_Result AS result, @p_Message AS message');

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete FormRole');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = FormRoleModel;