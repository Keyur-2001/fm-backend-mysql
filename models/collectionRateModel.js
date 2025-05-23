const poolPromise = require('../config/db.config');

class CollectionRateModel {
  static async getAllCollectionRates({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      console.log('getAllCollectionRates params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_GetCollectionRate(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllCollectionRates results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllCollectionRates output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_GetCollectionRate: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to retrieve collection rates');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1][0]?.TotalRecords || 0,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('getAllCollectionRates error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async createCollectionRate(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null,
        data.warehouseId,
        data.distanceRadiusMin,
        data.distanceRadiusMax,
        data.rate,
        data.currencyId,
        data.createdById
      ];

      console.log('createCollectionRate params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageCollectionRate(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('createCollectionRate results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('createCollectionRate output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageCollectionRate: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to create collection rate');
      }

      const collectionRateIdMatch = output[0].p_Message.match(/ID: (\d+)/);
      const collectionRateId = collectionRateIdMatch ? parseInt(collectionRateIdMatch[1]) : null;

      return {
        collectionRateId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createCollectionRate error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getCollectionRateById(id) {
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
        null
      ];

      console.log('getCollectionRateById params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageCollectionRate(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getCollectionRateById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getCollectionRateById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageCollectionRate: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to retrieve collection rate');
      }

      if (!results[0] || results[0].length === 0) {
        throw new Error('Collection rate not found');
      }

      return results[0][0];
    } catch (err) {
      console.error('getCollectionRateById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateCollectionRate(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.warehouseId,
        data.distanceRadiusMin,
        data.distanceRadiusMax,
        data.rate,
        data.currencyId,
        data.createdById
      ];

      console.log('updateCollectionRate params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageCollectionRate(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('updateCollectionRate results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updateCollectionRate output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageCollectionRate: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to update collection rate');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateCollectionRate error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async deleteCollectionRate(id, createdById) {
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
        createdById
      ];

      console.log('deleteCollectionRate params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManageCollectionRate(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('deleteCollectionRate results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deleteCollectionRate output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageCollectionRate: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to delete collection rate');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteCollectionRate error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CollectionRateModel;