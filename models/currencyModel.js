const poolPromise = require('../config/db.config');

class CurrencyModel {
  // Get paginated Currencies
  static async getAllCurrencies({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Call SP_GetAllCurrencies
      const [results] = await pool.query(
        'CALL SP_GetAllCurrencies(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 0) {
        throw new Error(outParams.message || 'Failed to retrieve currencies');
      }

      return {
        data: results[0],
        totalRecords: null // SP does not return total count
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Currency
  static async createCurrency(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_CurrencyID
        data.currencyName,
        data.createdById
      ];

      // Call SP_ManageCurrency
      await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Currency');
      }

      return {
        currencyId: null, // SP does not return new ID
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Currency by ID
  static async getCurrencyById(id) {
    try {
      const pool = await poolPromise;

      // Call SP_ManageCurrency
      const [results] = await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        ['SELECT', id, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Currency not found');
      }

      return results[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Currency
  static async updateCurrency(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.currencyName || null,
        data.createdById
      ];

      // Call SP_ManageCurrency
      await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Currency');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Currency
  static async deleteCurrency(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_CurrencyName
        createdById || null // p_CreatedByID
      ];

      // Call SP_ManageCurrency
      await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Currency');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = CurrencyModel;