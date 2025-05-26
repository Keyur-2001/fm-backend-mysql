const sql = require('mssql');
const poolPromise = require('../config/db.config');

class PurchaseRFQParcelModel {
  static async #executeStoredProcedure(action, purchaseRFQParcelData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (purchaseRFQParcelData.PurchaseRFQParcelID) request.input('PurchaseRFQParcelID', sql.Int, parseInt(purchaseRFQParcelData.PurchaseRFQParcelID));
      if (purchaseRFQParcelData.PurchaseRFQID) request.input('PurchaseRFQID', sql.Int, parseInt(purchaseRFQParcelData.PurchaseRFQID));
      if (purchaseRFQParcelData.ParcelID) request.input('ParcelID', sql.Int, parseInt(purchaseRFQParcelData.ParcelID));
      if (purchaseRFQParcelData.ItemID) request.input('ItemID', sql.Int, parseInt(purchaseRFQParcelData.ItemID));
      if (purchaseRFQParcelData.LineItemNumber) request.input('LineItemNumber', sql.Int, parseInt(purchaseRFQParcelData.LineItemNumber));
      if (purchaseRFQParcelData.ItemQuantity) request.input('ItemQuantity', sql.Decimal(14, 4), parseFloat(purchaseRFQParcelData.ItemQuantity));
      if (purchaseRFQParcelData.UOMID) request.input('UOMID', sql.Int, parseInt(purchaseRFQParcelData.UOMID));
      if (purchaseRFQParcelData.Rate) request.input('Rate', sql.Decimal(14, 4), parseFloat(purchaseRFQParcelData.Rate));
      if (purchaseRFQParcelData.Amount) request.input('Amount', sql.Decimal(14, 4), parseFloat(purchaseRFQParcelData.Amount));
      if (purchaseRFQParcelData.LineNumber) request.input('LineNumber', sql.Int, parseInt(purchaseRFQParcelData.LineNumber));
      if (purchaseRFQParcelData.CreatedByID) request.input('CreatedByID', sql.Int, parseInt(purchaseRFQParcelData.CreatedByID));
      if (purchaseRFQParcelData.DeletedByID) request.input('DeletedByID', sql.Int, parseInt(purchaseRFQParcelData.DeletedByID));

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManagePurchaseRFQParcel');

      return {
        success: result.output.Result === 0,
        message: result.output.Message,
        data: action === 'SELECT' ? (purchaseRFQParcelData.PurchaseRFQParcelID ? result.recordset?.[0] || null : result.recordset || []) : null,
        purchaseRFQParcelId: purchaseRFQParcelData.PurchaseRFQParcelID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(purchaseRFQParcelData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT' || action === 'UPDATE') {
      if (purchaseRFQParcelData.PurchaseRFQID) {
        const purchaseRFQCheck = await pool.request()
          .input('PurchaseRFQID', sql.Int, purchaseRFQParcelData.PurchaseRFQID)
          .query('SELECT 1 FROM [dbo].[tblPurchaseRFQ] WHERE PurchaseRFQID = @PurchaseRFQID AND IsDeleted = 0');
        if (purchaseRFQCheck.recordset.length === 0) errors.push(`PurchaseRFQID ${purchaseRFQParcelData.PurchaseRFQID} does not exist or is deleted`);
      }
      if (purchaseRFQParcelData.ItemID) {
        const itemCheck = await pool.request()
          .input('ItemID', sql.Int, purchaseRFQParcelData.ItemID)
          .query('SELECT 1 FROM [dbo].[tblItem] WHERE ItemID = @ItemID');
        if (itemCheck.recordset.length === 0) errors.push(`ItemID ${purchaseRFQParcelData.ItemID} does not exist`);
      }
      if (purchaseRFQParcelData.UOMID) {
        const uomCheck = await pool.request()
          .input('UOMID', sql.Int, purchaseRFQParcelData.UOMID)
          .query('SELECT 1 FROM [dbo].[tblUOM] WHERE UOMID = @UOMID');
        if (uomCheck.recordset.length === 0) errors.push(`UOMID ${purchaseRFQParcelData.UOMID} does not exist`);
      }
      if (purchaseRFQParcelData.CreatedByID) {
        const createdByCheck = await pool.request()
          .input('CreatedByID', sql.Int, purchaseRFQParcelData.CreatedByID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @CreatedByID');
        if (createdByCheck.recordset.length === 0) errors.push(`CreatedByID ${purchaseRFQParcelData.CreatedByID} does not exist`);
      }
    }

    if (action === 'DELETE' && purchaseRFQParcelData.DeletedByID) {
      const deletedByCheck = await pool.request()
        .input('DeletedByID', sql.Int, purchaseRFQParcelData.DeletedByID)
        .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @DeletedByID');
      if (deletedByCheck.recordset.length === 0) errors.push(`DeletedByID ${purchaseRFQParcelData.DeletedByID} does not exist`);
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async createPurchaseRFQParcel(purchaseRFQParcelData) {
    const requiredFields = ['PurchaseRFQID', 'ItemID', 'ItemQuantity', 'UOMID', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => !purchaseRFQParcelData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        purchaseRFQParcelId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(purchaseRFQParcelData, 'INSERT');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        purchaseRFQParcelId: null
      };
    }

    // Note: INSERT is not implemented in the stored procedure
    return await this.#executeStoredProcedure('INSERT', purchaseRFQParcelData);
  }

  static async updatePurchaseRFQParcel(purchaseRFQParcelData) {
    if (!purchaseRFQParcelData.PurchaseRFQParcelID) {
      return {
        success: false,
        message: 'PurchaseRFQParcelID is required for UPDATE',
        data: null,
        purchaseRFQParcelId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(purchaseRFQParcelData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        purchaseRFQParcelId: purchaseRFQParcelData.PurchaseRFQParcelID
      };
    }

    return await this.#executeStoredProcedure('UPDATE', purchaseRFQParcelData);
  }

  static async deletePurchaseRFQParcel(purchaseRFQParcelData) {
    if (!purchaseRFQParcelData.PurchaseRFQParcelID) {
      return {
        success: false,
        message: 'PurchaseRFQParcelID is required for DELETE',
        data: null,
        purchaseRFQParcelId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(purchaseRFQParcelData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        purchaseRFQParcelId: purchaseRFQParcelData.PurchaseRFQParcelID
      };
    }

    return await this.#executeStoredProcedure('DELETE', purchaseRFQParcelData);
  }

  static async getPurchaseRFQParcel(purchaseRFQParcelData) {
    return await this.#executeStoredProcedure('SELECT', purchaseRFQParcelData);
  }
}

module.exports = PurchaseRFQParcelModel;