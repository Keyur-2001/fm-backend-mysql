const poolPromise = require('../config/db.config');

class CountryOfOriginModel {
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

      // Call SP_ManageCountryOfOrigin
      await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Country of Origin');
      }

      return {
        countryOfOriginId: null, // SP does not return new ID
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Country of Origin by ID
  static async getCountryOfOriginById(id) {
    try {
      const pool = await poolPromise;

      // Call SP_ManageCountryOfOrigin
      const [result] = await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        ['SELECT', id, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Country of Origin not found');
      }

      return result[0][0] || null;
    } catch (err) {
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
        data.countryOfOrigin || null,
        data.createdById
      ];

      // Call SP_ManageCountryOfOrigin
      await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Country of Origin');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
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
        createdById || null // p_CreatedByID
      ];

      // Call SP_ManageCountryOfOrigin
      await pool.query(
        'CALL SP_ManageCountryOfOrigin(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Country of Origin');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CountryOfOriginModel;