const poolPromise = require('../config/db.config');

class PurchaseOrderModel {
  static async #executeManageStoredProcedure(action, purchaseOrderData) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        action,
        purchaseOrderData.POID ? parseInt(purchaseOrderData.POID) : null,
        purchaseOrderData.SalesOrderID ? parseInt(purchaseOrderData.SalesOrderID) : null,
        purchaseOrderData.CreatedByID ? parseInt(purchaseOrderData.CreatedByID) : null
      ];

      const [result] = await pool.query(
        'CALL SP_ManageFULLPO(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? `${action} operation successful` : 'Operation failed'),
        data: action === 'SELECT' ? result[0] || [] : null,
        poId: purchaseOrderData.POID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(purchaseOrderData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT') {
      if (purchaseOrderData.SalesOrderID) {
        const [salesOrderCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsalesorder WHERE SalesOrderID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(purchaseOrderData.SalesOrderID)]
        );
        if (salesOrderCheck.length === 0) errors.push(`SalesOrderID ${purchaseOrderData.SalesOrderID} does not exist`);
      }
      if (purchaseOrderData.CreatedByID) {
        const [createdByCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblperson WHERE PersonID = ?',
          [parseInt(purchaseOrderData.CreatedByID)]
        );
        if (createdByCheck.length === 0) errors.push(`CreatedByID ${purchaseOrderData.CreatedByID} does not exist`);
      }
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async getPurchaseOrderById(poId) {
    try {
      if (!poId) {
        return {
          success: false,
          message: 'POID is required for SELECT',
          data: null,
          poId: null
        };
      }

      const purchaseOrderData = { POID: poId };
      const result = await this.#executeManageStoredProcedure('SELECT', purchaseOrderData);

      return {
        success: result.success,
        message: result.message,
        data: result.data,
        poId: poId
      };
    } catch (error) {
      console.error('Error in getPurchaseOrderById:', error);
      return {
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        poId: poId
      };
    }
  }

  static async createPurchaseOrder(purchaseOrderData) {
    try {
      const pool = await poolPromise;

      const requiredFields = ['SalesOrderID', 'CreatedByID'];
      const missingFields = requiredFields.filter(field => !purchaseOrderData[field]);
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `${missingFields.join(', ')} are required`,
          data: null,
          poId: null
        };
      }

      const fkErrors = await this.#validateForeignKeys(purchaseOrderData, 'INSERT');
      if (fkErrors) {
        return {
          success: false,
          message: `Validation failed: ${fkErrors}`,
          data: null,
          poId: null
        };
      }

      const queryParams = [
        'INSERT',
        null,
        purchaseOrderData.SalesOrderID ? parseInt(purchaseOrderData.SalesOrderID) : null,
        purchaseOrderData.CreatedByID ? parseInt(purchaseOrderData.CreatedByID) : null
      ];

      const [result] = await pool.query(
        'CALL SP_ManageFULLPO(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? 'Purchase Order created successfully' : 'Operation failed'),
        data: null,
        poId: null
      };
    } catch (error) {
      console.error('Database error in createPurchaseOrder:', error);
      return {
        success: false,
        message: `Database error: ${error.message || 'Unknown error'}`,
        data: null,
        poId: null
      };
    }
  }

  static async getAllPurchaseOrders({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber,
        pageSize,
        fromDate || null,
        toDate || null
      ];

      const [result] = await pool.query(
        'CALL SP_GetAllPO(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      const purchaseOrders = result[0] || [];

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? 'Purchase orders retrieved successfully' : 'Operation failed'),
        data: purchaseOrders,
        totalRecords: purchaseOrders.length
      };
    } catch (error) {
      console.error('Error in getAllPurchaseOrders:', error);
      return {
        success: false,
        message: `Server error: ${error.message}`,
        data: [],
        totalRecords: 0
      };
    }
  }
}

module.exports = PurchaseOrderModel;