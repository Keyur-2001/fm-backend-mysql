const poolPromise = require('../config/db.config');

class CurrencyModel {
  // Helper method to check if currencyName is unique
  static async checkCurrencyNameUniqueness(currencyName, excludeCurrencyId = null) {
    try {
      const pool = await poolPromise;
      let query = 'SELECT COUNT(*) AS count FROM dbo_tblcurrency WHERE CurrencyName = ?';
      let params = [currencyName.trim()];

      if (excludeCurrencyId && !isNaN(excludeCurrencyId)) {
        query += ' AND CurrencyID != ?';
        params.push(Number(excludeCurrencyId));
      }

      console.log('checkCurrencyNameUniqueness query:', query);
      console.log('checkCurrencyNameUniqueness params:', params);

      const [results] = await pool.query(query, params);
      const isUnique = results[0].count === 0;

      console.log(`Currency name '${currencyName}' isUnique: ${isUnique}`);
      return isUnique;
    } catch (error) {
      console.error('Error checking currency name uniqueness:', error.stack);
      if (error.code === 'ER_NO_SUCH_TABLE') {
        throw new Error('Currency table (dbo_tblcurrency) does not exist in the database');
      }
      throw new Error(`Failed to check currency name uniqueness: ${error.message}`);
    }
  }

  // Get paginated Currencies
  static async getAllCurrencies({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const pageNum = parseInt(pageNumber, 10);
      const pageSz = parseInt(pageSize, 10);
      if (isNaN(pageNum) || pageNum < 1 || isNaN(pageSz) || pageSz < 1) {
        throw new Error('Invalid pageNumber or pageSize');
      }

      const queryParams = [
        pageNum,
        pageSz,
        fromDate && /^\d{4}-\d{2}-\d{2}$/.test(fromDate) ? fromDate : null,
        toDate && /^\d{4}-\d{2}-\d{2}$/.test(toDate) ? toDate : null
      ];

      console.log('getAllCurrencies params:', JSON.stringify(queryParams, null, 2));

      // Call SP_GetAllCurrencies
      const [results] = await pool.query(
        'CALL SP_GetAllCurrencies(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllCurrencies results:', JSON.stringify(results, null, 2));

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      console.log('getAllCurrencies outParams:', JSON.stringify(outParams, null, 2));

      if (!outParams || outParams.result === null) {
        throw new Error('Invalid output from SP_GetAllCurrencies');
      }

      if (outParams.result !== 0) {
        throw new Error(outParams.message || 'Failed to retrieve currencies');
      }

      return {
        data: Array.isArray(results[0]) ? results[0] : [],
        totalRecords: null // SP does not return total count
      };
    } catch (error) {
      console.error('getAllCurrencies error:', error.stack);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Create a new Currency
  static async createCurrency(data) {
    try {
      const pool = await poolPromise;

      // Validate input
      if (!data.currencyName || typeof data.currencyName !== 'string' || data.currencyName.trim() === '') {
        throw new Error('Invalid input: CurrencyName is required');
      }
      if (!data.createdById || isNaN(parseInt(data.createdById))) {
        throw new Error('Invalid input: CreatedById is required');
      }

      // Check for duplicate currencyName
      const isUnique = await this.checkCurrencyNameUniqueness(data.currencyName);
      if (!isUnique) {
        throw new Error(`Currency name '${data.currencyName}' already exists`);
      }

      const queryParams = [
        'INSERT',
        null, // p_CurrencyID
        data.currencyName.trim(),
        parseInt(data.createdById)
      ];

      console.log('createCurrency params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageCurrency
      await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      console.log('createCurrency outParams:', JSON.stringify(outParams, null, 2));

      if (!outParams || outParams.result === null) {
        throw new Error('Invalid output from SP_ManageCurrency');
      }

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Currency');
      }

      // Extract CurrencyID from message (e.g., "Currency created successfully. ID: 1")
      const currencyIdMatch = outParams.message.match(/ID: (\d+)/);
      const currencyId = currencyIdMatch ? parseInt(currencyIdMatch[1]) : null;

      return {
        currencyId,
        message: outParams.message || 'Currency created successfully'
      };
    } catch (error) {
      console.error('createCurrency error:', error.stack);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get a single Currency by ID
  static async getCurrencyById(id) {
    try {
      const pool = await poolPromise;

      const currencyId = parseInt(id, 10);
      if (isNaN(currencyId) || currencyId < 1) {
        throw new Error('Invalid currencyId');
      }

      const queryParams = ['SELECT', currencyId, null, null];

      console.log('getCurrencyById params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageCurrency
      const [results] = await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getCurrencyById results:', JSON.stringify(results, null, 2));

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      console.log('getCurrencyById outParams:', JSON.stringify(outParams, null, 2));

      if (!outParams || outParams.result === null) {
        throw new Error('Invalid output from SP_ManageCurrency');
      }

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Currency not found');
      }

      return results[0][0] || null;
    } catch (error) {
      console.error('getCurrencyById error:', error.stack);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Update a Currency
  static async updateCurrency(id, data) {
    try {
      const pool = await poolPromise;

      const currencyId = parseInt(id, 10);
      if (isNaN(currencyId) || currencyId < 1) {
        throw new Error('Invalid currencyId');
      }

      // Validate input
      if (!data.currencyName || typeof data.currencyName !== 'string' || data.currencyName.trim() === '') {
        throw new Error('Invalid input: CurrencyName is required');
      }
      if (!data.createdById || isNaN(parseInt(data.createdById))) {
        throw new Error('Invalid input: CreatedById is required');
      }

      // Check for duplicate currencyName
      const isUnique = await this.checkCurrencyNameUniqueness(data.currencyName, currencyId);
      if (!isUnique) {
        throw new Error(`Currency name '${data.currencyName}' already exists`);
      }

      const queryParams = [
        'UPDATE',
        currencyId,
        data.currencyName.trim(),
        parseInt(data.createdById)
      ];

      console.log('updateCurrency params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageCurrency
      await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      console.log('updateCurrency outParams:', JSON.stringify(outParams, null, 2));

      if (!outParams || outParams.result === null) {
        throw new Error('Invalid output from SP_ManageCurrency');
      }

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Currency');
      }

      return {
        message: outParams.message || 'Currency updated successfully'
      };
    } catch (error) {
      console.error('updateCurrency error:', error.stack);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Delete a Currency
  static async deleteCurrency(id, createdById) {
    try {
      const pool = await poolPromise;

      const currencyId = parseInt(id, 10);
      if (isNaN(currencyId) || currencyId < 1) {
        throw new Error('Invalid currencyId');
      }

      const validatedCreatedById = createdById && !isNaN(parseInt(createdById)) ? parseInt(createdById) : null;
      if (!validatedCreatedById) {
        throw new Error('Invalid createdById');
      }

      const queryParams = [
        'DELETE',
        currencyId,
        null,
        validatedCreatedById
      ];

      console.log('deleteCurrency params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageCurrency
      await pool.query(
        'CALL SP_ManageCurrency(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      console.log('deleteCurrency outParams:', JSON.stringify(outParams, null, 2));

      if (!outParams || outParams.result === null) {
        throw new Error('Invalid output from SP_ManageCurrency');
      }

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Currency');
      }

      return {
        message: outParams.message || 'Currency deleted successfully'
      };
    } catch (error) {
      console.error('deleteCurrency error:', error.stack);
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = CurrencyModel;