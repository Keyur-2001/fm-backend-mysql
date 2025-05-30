const poolPromise = require('../config/db.config');

class UOMModel {
  // Get paginated UOMs
  static async getAllUOMs({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      console.log('getAllUOMs params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_GetAllUOMs(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllUOMs results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllUOMs output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_GetAllUOMs: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to retrieve UOMs');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1][0]?.TotalRecords || 0
      };
    } catch (err) {
      console.error('getAllUOMs error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new UOM
  static async createUOM(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_UOMID
        data.uom,
        data.createdById,
        data.DeletedByID
        
      ];

      console.log('createUOM params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageUOM(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('createUOM results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('createUOM output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageUOM: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to create UOM');
      }

      // Extract UOMID from message
      const uomIdMatch = output[0].p_Message.match(/ID: (\d+)/);
      const uomId = uomIdMatch ? parseInt(uomIdMatch[1]) : null;

      return {
        uomId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createUOM error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single UOM by ID
  static async getUOMById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_UOM
        null,// p_CreatedByID
        null
      ];

      console.log('getUOMById params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageUOM(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getUOMById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getUOMById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageUOM: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'UOM not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getUOMById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a UOM
  static async updateUOM(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.uom,
        data.createdById,
        data.DeletedByID

      ];

      console.log('updateUOM params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageUOM(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('updateUOM results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updateUOM output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageUOM: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to update UOM');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateUOM error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a UOM
  static async deleteUOM(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_UOM
        createdById,
        null
      ];

      console.log('deleteUOM params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageUOM(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('deleteUOM results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deleteUOM output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageUOM: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to delete UOM');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteUOM error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = UOMModel;