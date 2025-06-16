const poolPromise = require('../config/db.config');

class BankAccountModel {
  // Get all BankAccounts with pagination
  static async getAllBankAccounts({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        null, // p_BankAccountID
        null, // p_AccountName
        null, // p_AccountType
        null, // p_BankName
        null, // p_BranchCode
        null, // p_IBAN
        null, // p_IFSC
        null, // p_MICRA
        null, // p_AccountVerified
        null, // p_IsDefaultAccount
        null, // p_Disabled
        null  // p_CreatedByID
      ];

      const [result] = await pool.query(
        'CALL sp_ManageBankAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS Result, @p_Message AS Message'
      );

      if (outParams.Result !== 1) {
        return {
          success: false,
          message: outParams.Message || 'Failed to retrieve BankAccounts',
          data: null,
          totalRecords: 0
        };
      }

      let accounts = result[0] || [];
      const totalRecords = accounts.length;
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      accounts = accounts.slice(start, end);

      return {
        success: true,
        message: outParams.Message || 'BankAccounts retrieved successfully.',
        data: accounts,
        totalRecords
      };
    } catch (err) {
      console.error('Database error in getAllBankAccounts:', err);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null,
        totalRecords: 0
      };
    }
  }

  // Create a new BankAccount
  static async createBankAccount(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_BankAccountID
        data.accountName,
        data.accountType || null,
        data.bankName,
        data.branchCode || null,
        data.iban || null,
        data.ifsc || null,
        data.micra || null,
        data.accountVerified || false,
        data.isDefaultAccount || false,
        data.disabled || false,
        data.createdById
      ];

      // Call sp_ManageBankAccount
      const [result] = await pool.query(
        'CALL sp_ManageBankAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const outParams = result[0][0] || {};

      if (outParams.Result !== 1) {
        throw new Error(outParams.Message || 'Failed to create BankAccount');
      }

      return {
        newBankAccountId: parseInt(outParams.Message.split('ID: ')[1]) || null,
        message: outParams.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single BankAccount by ID
  static async getBankAccountById(id) {
    try {
      const pool = await poolPromise;

      // Call sp_ManageBankAccount
      const [result] = await pool.query(
        'CALL sp_ManageBankAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['SELECT', id, null, null, null, null, null, null, null, null, null, null, null]
      );

      const outParams = result[1]?.[0] || {};

      if (outParams.Result !== 1 && outParams.Result !== undefined) {
        throw new Error(outParams.Message || 'BankAccount not found');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a BankAccount
  static async updateBankAccount(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.accountName || null,
        data.accountType || null,
        data.bankName || null,
        data.branchCode || null,
        data.iban || null,
        data.ifsc || null,
        data.micra || null,
        data.accountVerified || null,
        data.isDefaultAccount || null,
        data.disabled || null,
        data.createdById
      ];

      // Call sp_ManageBankAccount
      const [result] = await pool.query(
        'CALL sp_ManageBankAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const outParams = result[0][0] || {};

      if (outParams.Result !== 1) {
        throw new Error(outParams.Message || 'Failed to update BankAccount');
      }

      return {
        message: outParams.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a BankAccount
  static async deleteBankAccount(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, null, null, null, null, null, null, null, null, null,
        createdById
      ];

      // Call sp_ManageBankAccount
      const [result] = await pool.query(
        'CALL sp_ManageBankAccount(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const outParams = result[0][0] || {};

      if (outParams.Result !== 1) {
        throw new Error(outParams.Message || 'Failed to delete BankAccount');
      }

      return {
        message: outParams.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = BankAccountModel;