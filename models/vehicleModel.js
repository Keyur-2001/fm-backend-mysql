const poolPromise = require('../config/db.config');

class VehicleModel {
  static async getAllVehicles({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10
      ];

      console.log('getAllVehicles params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_GetAllVehicles(?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllVehicles results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllVehicles output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_GetAllVehicles: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to retrieve vehicles');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1][0]?.TotalRecords || 0
      };
    } catch (err) {
      console.error('getAllVehicles error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async createVehicle(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null,
        data.truckNumberPlate,
        data.vin,
        data.companyId,
        data.maxWeight,
        data.maxVolume,
        data.length,
        data.width,
        data.height,
        data.vehicleTypeId,
        data.numberOfWheels,
        data.numberOfAxels,
        data.createdById
      ];

      console.log('createVehicle params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageVehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('createVehicle results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('createVehicle output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageVehicle: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to create vehicle');
      }

      const vehicleIdMatch = output[0].p_Message.match(/ID: (\d+)/);
      const vehicleId = vehicleIdMatch ? parseInt(vehicleIdMatch[1]) : null;

      return {
        vehicleId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createVehicle error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getVehicleById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ];

      console.log('getVehicleById params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageVehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getVehicleById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getVehicleById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageVehicle: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Vehicle not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getVehicleById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateVehicle(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.truckNumberPlate,
        data.vin,
        data.companyId,
        data.maxWeight,
        data.maxVolume,
        data.length,
        data.width,
        data.height,
        data.vehicleTypeId,
        data.numberOfWheels,
        data.numberOfAxels,
        data.createdById
      ];

      console.log('updateVehicle params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageVehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('updateVehicle results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updateVehicle output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageVehicle: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to update vehicle');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateVehicle error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async deleteVehicle(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        createdById
      ];

      console.log('deleteVehicle params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageVehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('deleteVehicle results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deleteVehicle output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageVehicle: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to delete vehicle');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteVehicle error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = VehicleModel;