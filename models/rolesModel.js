const poolPromise = require('../config/db.config');

class RoleModel {
  // Get paginated Roles
  static async getAllRoles({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null, roleName = null, createdBy = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null,
        roleName || null,
        createdBy || null
      ];

      // Call SP_GetAllRoles
      const [result] = await pool.query(
        'CALL SP_GetAllRoles(?, ?, ?, ?, ?, ?, @p_TotalRecords)',
        queryParams
      );

      // Retrieve OUT parameter
      const [[outParams]] = await pool.query('SELECT @p_TotalRecords AS totalRecords');

      if (outParams.totalRecords === -1) {
        throw new Error('Failed to retrieve Roles');
      }

      return {
        data: result[0],
        totalRecords: outParams.totalRecords
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Role
  static async createRole(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_roleid
        data.roleName,
        data.description || null,
        data.createdById,
        null // p_deletedbyid
      ];

      // Call SP_ManageRoles
      await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, @p_newroleid, @p_result, @p_message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_newroleid AS newRoleId, @p_result AS result, @p_message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Role');
      }

      return {
        newRoleId: outParams.newRoleId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Role by ID
  static async getRoleById(id) {
    try {
      const pool = await poolPromise;

      // Call SP_ManageRoles
      const [result] = await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, @p_newroleid, @p_result, @p_message)',
        ['SELECT', id, null, null, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_result AS result, @p_message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Role not found');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Role
  static async updateRole(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.roleName || null,
        data.description || null,
        data.createdById,
        null // p_deletedbyid
      ];

      // Call SP_ManageRoles
      await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, @p_newroleid, @p_result, @p_message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_result AS result, @p_message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Role');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Role
  static async deleteRole(id, userId) {
  try {
    const pool = await poolPromise;
    const queryParams = [
      'DELETE',
      id,
      null, // p_rolename
      null, // p_description
      null, // p_createdbyid
      userId || null // p_userid
    ];
    await pool.query(
      'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, @p_newroleid, @p_result, @p_message)',
      queryParams
    );
    const [[outParams]] = await pool.query(
      'SELECT @p_result AS result, @p_message AS message'
    );
    if (outParams.result !== 1) {
      throw new Error(outParams.message || 'Failed to delete Role');
    }
    return { message: outParams.message };
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
}
}

module.exports = RoleModel;