const poolPromise = require('../config/db.config');

class WarehouseModel {
  static async getAllWarehouses({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      console.log('getAllWarehouses params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_GetAllWarehouses(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllWarehouses results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllWarehouses output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_GetAllWarehouses: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to retrieve warehouses');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1][0]?.TotalRecords || 0
      };
    } catch (err) {
      console.error('getAllWarehouses error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async createWarehouse(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null,
        data.warehouseName,
        data.warehouseAddressId,
        data.createdById
      ];

      console.log('createWarehouse params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageWarehouse(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('createWarehouse results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('createWarehouse output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageWarehouse: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to create warehouse');
      }

      const warehouseIdMatch = output[0].p_Message.match(/ID: (\d+)/);
      const warehouseId = warehouseIdMatch ? parseInt(warehouseIdMatch[1]) : null;

      return {
        warehouseId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createWarehouse error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getWarehouseById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null,
        null,
        null
      ];

      console.log('getWarehouseById params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageWarehouse(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getWarehouseById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getWarehouseById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageWarehouse: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Warehouse not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getWarehouseById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateWarehouse(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.warehouseName,
        data.warehouseAddressId,
        data.createdById
      ];

      console.log('updateWarehouse params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageWarehouse(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('updateWarehouse results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updateWarehouse output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageWarehouse: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to update warehouse');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateWarehouse error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async deleteWarehouse(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null,
        null,
        createdById
      ];

      console.log('deleteWarehouse params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageWarehouse(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('deleteWarehouse results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deleteWarehouse output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageWarehouse: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to delete warehouse');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteWarehouse error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = WarehouseModel;