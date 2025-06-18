const poolPromise = require('../config/db.config');

class CountryOfOriginModel {
  // Get paginated Countries of Origin
  static async getAllCountriesOfOrigin({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
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
      console.log('getAllCountriesOfOrigin params:', queryParams);

      // Call SP_GetAllCountryOfOrigin with session variables for OUT parameters
      const [results] = await pool.query(
        'CALL SP_GetAllCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAllCountriesOfOrigin results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getAllCountriesOfOrigin output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllCountryOfOrigin');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve Countries of Origin');
      }

      return {
        data: results[0] || [],
        totalRecords: null // SP does not return total count
      };
    } catch (err) {
      console.error('getAllCountriesOfOrigin error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Country of Origin
  static async createCountryOfOrigin(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_CountryOfOriginID
        data.countryOfOrigin,
        data.createdById
      ];

      // Log query parameters
      console.log('createCountryOfOrigin params:', queryParams);

      // Call SP_ManageCountryOfOrigin with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters, including p_CountryOfOriginID
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_CountryOfOriginID AS p_CountryOfOriginID');

      // Log output
      console.log('createCountryOfOrigin output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageCountryOfOrigin');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Country of Origin');
      }

      return {
        countryOfOriginId: output[0].p_CountryOfOriginID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createCountryOfOrigin error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Country of Origin by ID
  static async getCountryOfOriginById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_CountryOfOrigin
        null  // p_CreatedByID
      ];

      // Log query parameters
      console.log('getCountryOfOriginById params:', queryParams);

      // Call SP_ManageCountryOfOrigin with session variables for OUT parameters
      const [results] = await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getCountryOfOriginById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getCountryOfOriginById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageCountryOfOrigin');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Country of Origin not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getCountryOfOriginById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Country of Origin
  static async updateCountryOfOrigin(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.countryOfOrigin,
        data.createdById
      ];

      // Log query parameters
      console.log('updateCountryOfOrigin params:', queryParams);

      // Call SP_ManageCountryOfOrigin with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateCountryOfOrigin output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageCountryOfOrigin');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Country of Origin');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateCountryOfOrigin error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Country of Origin
  static async deleteCountryOfOrigin(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_CountryOfOrigin
        createdById
      ];

      // Log query parameters
      console.log('deleteCountryOfOrigin params:', queryParams);

      // Call SP_ManageCountryOfOrigin with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deleteCountryOfOrigin output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageCountryOfOrigin');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Country of Origin');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteCountryOfOrigin error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CountryOfOriginModel;