const sql = require('mssql');
const poolPromise = require('../config/db.config');

class PurchaseRFQApprovalModel {
  static async #executeManageStoredProcedure(action, approvalData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (approvalData.PurchaseRFQID) request.input('PurchaseRFQID', sql.Int, parseInt(approvalData.PurchaseRFQID));
      if (approvalData.ApproverID) request.input('ApproverID', sql.Int, parseInt(approvalData.ApproverID));
      if (approvalData.ApprovedYN != null) request.input('ApprovedYN', sql.Bit, approvalData.ApprovedYN);
      if (approvalData.ApproverDateTime) request.input('ApproverDateTime', sql.DateTime, new Date(approvalData.ApproverDateTime));

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManagePurchaseRFQApproval');

      return {
        success: result.output.Result === 0,
        message: result.output.Message || `${action} operation ${result.output.Result === 0 ? 'successful' : 'failed'}`,
        data: action === 'SELECT' ? result.recordset || [] : null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #executeGetAllStoredProcedure(paginationData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('PageNumber', sql.Int, parseInt(paginationData.PageNumber) || 1);
      request.input('PageSize', sql.Int, parseInt(paginationData.PageSize) || 10);
      request.input('SortColumn', sql.NVarChar(50), paginationData.SortColumn || 'PurchaseRFQID');
      request.input('SortDirection', sql.NVarChar(4), paginationData.SortDirection || 'ASC');
      if (paginationData.PurchaseRFQID) request.input('PurchaseRFQID', sql.Int, parseInt(paginationData.PurchaseRFQID));
      if (paginationData.ApproverID) request.input('ApproverID', sql.Int, parseInt(paginationData.ApproverID));
      if (paginationData.ApprovedYN != null) request.input('ApprovedYN', sql.Bit, paginationData.ApprovedYN);

      // Output parameters
      request.output('TotalRecords', sql.Int);
      request.output('Result', sql.Bit);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_GetPurchaseRFQApprovals');

      // Initialize pagination metadata
      const totalRecords = result.output.TotalRecords || 0;
      const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / (parseInt(paginationData.PageSize) || 10)) : 0;
      const currentPage = parseInt(paginationData.PageNumber) || 1;
      const pageSize = parseInt(paginationData.PageSize) || 10;

      return {
        success: result.output.Result === 1,
        message: result.output.Message || 'No records found',
        data: result.recordset || [],
        totalRecords,
        totalPages,
        currentPage,
        pageSize,
        purchaseRFQId: paginationData.PurchaseRFQID
      };
    } catch (error) {
      console.error('Database error in SP_GetPurchaseRFQApprovals:', error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(approvalData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT' || action === 'UPDATE') {
      if (approvalData.PurchaseRFQID) {
        const rfqCheck = await pool.request()
          .input('PurchaseRFQID', sql.Int, approvalData.PurchaseRFQID)
          .query('SELECT 1 FROM [dbo].[tblPurchaseRFQ] WHERE PurchaseRFQID = @PurchaseRFQID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (rfqCheck.recordset.length === 0) errors.push(`PurchaseRFQID ${approvalData.PurchaseRFQID} does not exist or is deleted`);
      }
      if (approvalData.ApproverID) {
        const approverCheck = await pool.request()
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @ApproverID');
        if (approverCheck.recordset.length === 0) errors.push(`ApproverID ${approvalData.ApproverID} does not exist`);
      }
    }

    if (action === 'UPDATE' || action === 'DELETE') {
      if (approvalData.PurchaseRFQID && approvalData.ApproverID) {
        const approvalCheck = await pool.request()
          .input('PurchaseRFQID', sql.Int, approvalData.PurchaseRFQID)
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblPurchaseRFQApproval] WHERE PurchaseRFQID = @PurchaseRFQID AND ApproverID = @ApproverID');
        if (approvalCheck.recordset.length === 0) errors.push(`Approval record for PurchaseRFQID ${approvalData.PurchaseRFQID} and ApproverID ${approvalData.ApproverID} does not exist`);
      }
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async createPurchaseRFQApproval(approvalData) {
    const requiredFields = ['PurchaseRFQID', 'ApproverID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'INSERT');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    return await this.#executeManageStoredProcedure('INSERT', approvalData);
  }

  static async getPurchaseRFQApproval(approvalData) {
    const requiredFields = ['PurchaseRFQID', 'ApproverID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    return await this.#executeManageStoredProcedure('SELECT', approvalData);
  }

  static async updatePurchaseRFQApproval(approvalData) {
    const requiredFields = ['PurchaseRFQID', 'ApproverID', 'ApprovedYN'];
    const missingFields = requiredFields.filter(field => !approvalData[field] && approvalData[field] !== false);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    return await this.#executeManageStoredProcedure('UPDATE', approvalData);
  }

  static async deletePurchaseRFQApproval(approvalData) {
    const requiredFields = ['PurchaseRFQID', 'ApproverID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        purchaseRFQId: approvalData.PurchaseRFQID
      };
    }

    return await this.#executeManageStoredProcedure('DELETE', approvalData);
  }

  static async getAllPurchaseRFQApprovals() {
    return await this.#executeManageStoredProcedure('SELECT', {});
  }

  static async getPaginatedPurchaseRFQApprovals(paginationData) {
    return await this.#executeGetAllStoredProcedure(paginationData);
  }
}

module.exports = PurchaseRFQApprovalModel;