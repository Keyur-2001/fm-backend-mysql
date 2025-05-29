const poolPromise = require('../config/db.config');

class RoleModel {
  // Get paginated Roles with filtering
  static async getAllRoles({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null, roleName = null, createdById = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null,
        roleName || null,
        createdById || null
      ];

      // Log query parameters
      console.log('getAllRoles params:', queryParams);

      // Call SP_GetAllRoles
      const [results] = await pool.query(
        'CALL SP_GetAllRoles(?, ?, ?, ?, ?, ?, @p_TotalRecords)',
        queryParams
      );

      // Log results
      console.log('getAllRoles results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_TotalRecords AS p_TotalRecords');

      // Log output
      console.log('getAllRoles output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_TotalRecords === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllRoles');
      }

      if (output[0].p_TotalRecords === -1) {
        throw new Error('Failed to retrieve roles');
      }

      return {
        data: results[0] || [],
        totalRecords: output[0].p_TotalRecords
      };
    } catch (err) {
      console.error('getAllRoles error:', err);
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
        data.description,
        data.createdById,
        null // p_deletedbyid
      ];

      // Log query parameters
      console.log('createRole params:', queryParams);

      // Call SP_ManageRoles
      const [results] = await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [...queryParams, null, null, null] // Append output parameters
      );

      // Log results
      console.log('createRole results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_result AS p_result, @p_message AS p_message, @p_newroleid AS p_newroleid');

      // Log output
      console.log('createRole output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageRoles');
      }

      if (output[0].p_result !== 1) {
        throw new Error(output[0].p_message || 'Failed to create Role');
      }

      return {
        roleId: output[0].p_newroleid || null,
        message: output[0].p_message
      };
    } catch (err) {
      console.error('createRole error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Role by ID
  static async getRoleById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_rolename
        null, // p_description
        null, // p_createdbyid
        null  // p_deletedbyid
      ];

      // Log query parameters
      console.log('getRoleById params:', queryParams);

      // Call SP_ManageRoles
      const [results] = await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [...queryParams, null, null, null] // Append output parameters
      );

      // Log results
      console.log('getRoleById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_result AS p_result, @p_message AS p_message');

      // Log output
      console.log('getRoleById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageRoles');
      }

      if (output[0].p_result !== 1) {
        throw new Error(output[0].p_message || 'Role not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getRoleById error:', err);
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
        data.roleName,
        data.description,
        data.createdById,
        null // p_deletedbyid
      ];

      // Log query parameters
      console.log('updateRole params:', queryParams);

      // Call SP_ManageRoles
      const [results] = await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [...queryParams, null, null, null] // Append output parameters
      );

      // Log results
      console.log('updateRole results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_result AS p_result, @p_message AS p_message');

      // Log output
      console.log('updateRole output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageRoles');
      }

      if (output[0].p_result !== 1) {
        throw new Error(output[0].p_message || 'Failed to update Role');
      }

      return {
        message: output[0].p_message
      };
    } catch (err) {
      console.error('updateRole error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Role
  static async deleteRole(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_rolename
        null, // p_description
        null, // p_createdbyid
        deletedById
      ];

      // Log query parameters
      console.log('deleteRole params:', queryParams);

      // Call SP_ManageRoles
      const [results] = await pool.query(
        'CALL SP_ManageRoles(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [...queryParams, null, null, null] // Append output parameters
      );

      // Log results
      console.log('deleteRole results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_result AS p_result, @p_message AS p_message');

      // Log output
      console.log('deleteRole output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageRoles');
      }

      if (output[0].p_result !== 1) {
        throw new Error(output[0].p_message || 'Failed to delete Role');
      }

      return {
        message: output[0].p_message
      };
    } catch (err) {
      console.error('deleteRole error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = RoleModel;