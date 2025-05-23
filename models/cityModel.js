const poolPromise = require('../config/db.config');

class CityModel {
  // Get paginated Cities
  static async getAllCities({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Call SP_GetAllCities
      const [results] = await pool.query(
        'CALL SP_GetAllCities(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 0) {
        throw new Error(outParams.message || 'Failed to retrieve cities');
      }

      return {
        data: results[0],
        totalRecords: null // SP does not return total count
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new City
  static async createCity(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_CityID
        data.cityName,
        data.countryId || null,
        data.createdById
      ];

      // Call sp_ManageCity
      const [results] = await pool.query(
        'CALL sp_ManageCity(?, ?, ?, ?, ?)',
        queryParams
      );

      // Extract Result and Message
      const resultRow = results[0][0];
      if (resultRow.Result !== 1) {
        throw new Error(resultRow.Message || 'Failed to create City');
      }

      return {
        cityId: null, // SP does not return new ID
        message: resultRow.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single City by ID
  static async getCityById(id) {
    try {
      const pool = await poolPromise;

      // Call sp_ManageCity
      const [results] = await pool.query(
        'CALL sp_ManageCity(?, ?, ?, ?, ?)',
        ['SELECT', id, null, null, null]
      );

      // Extract Result and Message
      const resultRow = results[1][0];
      if (resultRow.Result !== 1) {
        throw new Error(resultRow.Message || 'City not found');
      }

      return results[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a City
  static async updateCity(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.cityName || null,
        data.countryId || null,
        data.createdById
      ];

      // Call sp_ManageCity
      const [results] = await pool.query(
        'CALL sp_ManageCity(?, ?, ?, ?, ?)',
        queryParams
      );

      // Extract Result and Message
      const resultRow = results[0][0];
      if (resultRow.Result !== 1) {
        throw new Error(resultRow.Message || 'Failed to update City');
      }

      return {
        message: resultRow.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a City
  static async deleteCity(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_CityName
        null, // p_CountryID
        createdById || null // p_CreatedByID
      ];

      // Call sp_ManageCity
      const [results] = await pool.query(
        'CALL sp_ManageCity(?, ?, ?, ?, ?)',
        queryParams
      );

      // Extract Result and Message
      const resultRow = results[0][0];
      if (resultRow.Result !== 1) {
        throw new Error(resultRow.Message || 'Failed to delete City');
      }

      return {
        message: resultRow.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CityModel;