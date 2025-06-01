const poolPromise = require('../config/db.config');

class POModel {
  static async createPO({ poId,salesOrderId, createdById }) {
    try {
      const pool = await poolPromise;
      const [results] = await pool.query(
        'CALL SP_ManageFULLPO(?, ?,?, ?, @p_Result, @p_Message)',
        ['INSERT', poId, salesOrderId, createdById]
      );
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      return {
        success: output[0].p_Result === 1,
        message: output[0].p_Message || 'Operation completed.',
        poId: null // SP_ManagePO doesn't return POID directly; adjust if needed
      };
    } catch (err) {
      console.error('createPO error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getAllPOs({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      const [results] = await pool.query(
        'CALL SP_GetAllPO(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve POs');
      }

      return {
        data: results[0] || [],
        totalRecords: results[0].length > 0 ? results[0].length : 0
      };
    } catch (err) {
      console.error('getAllPOs error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = POModel;