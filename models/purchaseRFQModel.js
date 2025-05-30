const poolPromise = require('../config/db.config');

class PurchaseRFQModel {
  // Get paginated Purchase RFQs
  static async getAllPurchaseRFQs({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10
      ];

      // Call SP_GetAllPurchaseRFQs
      const [result] = await pool.query(
        'CALL SP_GetAllPurchaseRFQs(?, ?, @totalRecords)',
        queryParams
      );

      // Retrieve OUT parameter
      const [[{ totalRecords }]] = await pool.query('SELECT @totalRecords AS totalRecords');

      return {
        data: result[0],
        totalRecords: totalRecords || 0
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Purchase RFQ
  static async createPurchaseRFQ(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_PurchaseRFQID
        data.SalesRFQID,
        data.CreatedByID,
        null // p_DeletedByID
      ];

      // Call SP_ManagePurchaseRFQ
      const [result] = await pool.query(
        'CALL SP_ManagePurchaseRFQ(?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewPurchaseRFQID)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message, @p_NewPurchaseRFQID AS newPurchaseRFQId'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Purchase RFQ');
      }

      return {
        newPurchaseRFQId: outParams.newPurchaseRFQId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Purchase RFQ by ID
  static async getPurchaseRFQById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_SalesRFQID
        null, // p_CreatedByID
        null // p_DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePurchaseRFQ(?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewPurchaseRFQID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message, @p_NewPurchaseRFQID AS newPurchaseRFQId'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Purchase RFQ not found or deleted');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Purchase RFQ
  static async updatePurchaseRFQ(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.SalesRFQID,
        data.CreatedByID,
        null // p_DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePurchaseRFQ(?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewPurchaseRFQID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Purchase RFQ');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Purchase RFQ
  static async deletePurchaseRFQ(id, DeletedByID) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_SalesRFQID
        null, // p_CreatedByID
        DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePurchaseRFQ(?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewPurchaseRFQID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Purchase RFQ');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = PurchaseRFQModel;