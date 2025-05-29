const sql = require('mssql');
const poolPromise = require('../config/db.config');

class SalesQuotationApprovalModel {
  static async #executeManageStoredProcedure(action, approvalData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (approvalData.SalesQuotationID) request.input('SalesQuotationID', sql.Int, parseInt(approvalData.SalesQuotationID));
      if (approvalData.ApproverID) request.input('ApproverID', sql.Int, parseInt(approvalData.ApproverID));
      if (approvalData.ApprovedYN != null) request.input('ApprovedYN', sql.Bit, approvalData.ApprovedYN);
      if (approvalData.ApproverDateTime) request.input('ApproverDateTime', sql.DateTime, new Date(approvalData.ApproverDateTime));
      if (approvalData.CreatedByID) request.input('CreatedByID', sql.Int, parseInt(approvalData.CreatedByID));
      if (approvalData.DeletedByID) request.input('DeletedByID', sql.Int, parseInt(approvalData.DeletedByID));

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageSalesQuotationApproval');

      return {
        success: result.output.Result === 0,
        message: result.output.Message || `${action} operation ${result.output.Result === 0 ? 'successful' : 'failed'}`,
        data: action === 'SELECT' ? result.recordset || [] : null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(approvalData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT' || action === 'UPDATE') {
      if (approvalData.SalesQuotationID) {
        const quotationCheck = await pool.request()
          .input('SalesQuotationID', sql.Int, approvalData.SalesQuotationID)
          .query('SELECT 1 FROM [dbo].[tblSalesQuotation] WHERE SalesQuotationID = @SalesQuotationID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (quotationCheck.recordset.length === 0) errors.push(`SalesQuotationID ${approvalData.SalesQuotationID} does not exist or is deleted`);
      }
      if (approvalData.ApproverID) {
        const approverCheck = await pool.request()
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @ApproverID');
        if (approverCheck.recordset.length === 0) errors.push(`ApproverID ${approvalData.ApproverID} does not exist`);
      }
      if (approvalData.CreatedByID) {
        const createdByCheck = await pool.request()
          .input('CreatedByID', sql.Int, approvalData.CreatedByID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @CreatedByID');
        if (createdByCheck.recordset.length === 0) errors.push(`CreatedByID ${approvalData.CreatedByID} does not exist`);
      }
    }

    if (action === 'UPDATE' || action === 'DELETE') {
      if (approvalData.SalesQuotationID && approvalData.ApproverID) {
        const approvalCheck = await pool.request()
          .input('SalesQuotationID', sql.Int, approvalData.SalesQuotationID)
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblSalesQuotationApproval] WHERE SalesQuotationID = @SalesQuotationID AND ApproverID = @ApproverID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (approvalCheck.recordset.length === 0) errors.push(`Approval record for SalesQuotationID ${approvalData.SalesQuotationID} and ApproverID ${approvalData.ApproverID} does not exist or is deleted`);
      }
    }

    if (action === 'DELETE') {
      if (approvalData.DeletedByID) {
        const deletedByCheck = await pool.request()
          .input('DeletedByID', sql.Int, approvalData.DeletedByID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @DeletedByID');
        if (deletedByCheck.recordset.length === 0) errors.push(`DeletedByID ${approvalData.DeletedByID} does not exist`);
      }
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async createSalesQuotationApproval(approvalData) {
    const requiredFields = ['SalesQuotationID', 'ApproverID', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'INSERT');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('INSERT', approvalData);
  }

  static async getSalesQuotationApproval(approvalData) {
    return await this.#executeManageStoredProcedure('SELECT', approvalData);
  }

  static async updateSalesQuotationApproval(approvalData) {
    const requiredFields = ['SalesQuotationID', 'ApproverID', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('UPDATE', approvalData);
  }

  static async deleteSalesQuotationApproval(approvalData) {
    const requiredFields = ['SalesQuotationID', 'ApproverID', 'DeletedByID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesQuotationId: approvalData.SalesQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('DELETE', approvalData);
  }
}

module.exports = SalesQuotationApprovalModel;