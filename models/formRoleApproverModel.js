const poolPromise = require('../config/db.config');

class FormRoleApproverModel {
  // Get paginated FormRoleApprovers
  static async getAllFormRoleApprovers({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10
      ];

      // Note: SP_ManageFormRoleApprover doesn't support pagination directly,
      // so we'll fetch all and manually paginate for now
      const [result] = await pool.query(
        'SELECT a.* FROM dbo_tblformroleapprover a'
      );

      // Manual pagination
      const totalRecords = result.length;
      const startIndex = (pageNumber - 1) * pageSize;
      const paginatedData = result.slice(startIndex, startIndex + pageSize);

      return {
        data: paginatedData,
        totalRecords
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new FormRoleApprover
  static async createFormRoleApprover(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_FormRoleApproverID
        data.formRoleId,
        data.userId,
        data.activeYN || 1,
        data.createdById
      ];

      // Call SP_ManageFormRoleApprover
      await pool.query(
        'CALL SP_ManageFormRoleApprover(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_FormRoleApproverID AS newFormRoleApproverId, @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create FormRoleApprover');
      }

      return {
        newFormRoleApproverId: outParams.newFormRoleApproverId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single FormRoleApprover by ID
  static async getFormRoleApproverById(id) {
    try {
      const pool = await poolPromise;

      // Call SP_ManageFormRoleApprover
      const [result] = await pool.query(
        'CALL SP_ManageFormRoleApprover(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        ['SELECT', id, null, null, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'FormRoleApprover not found');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a FormRoleApprover
  static async updateFormRoleApprover(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.formRoleId,
        data.userId,
        data.activeYN || 1,
        data.createdById
      ];

      // Call SP_ManageFormRoleApprover
      await pool.query(
        'CALL SP_ManageFormRoleApprover(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update FormRoleApprover');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a FormRoleApprover
  static async deleteFormRoleApprover(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null,
        null,
        null,
        createdById
      ];

      // Call SP_ManageFormRoleApprover
      await pool.query(
        'CALL SP_ManageFormRoleApprover(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete FormRoleApprover');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = FormRoleApproverModel;