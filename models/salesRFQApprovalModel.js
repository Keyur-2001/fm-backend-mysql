const sql = require('mssql');
const poolPromise = require('../config/db.config');

class SalesRFQApprovalModel {
  static async #executeManageStoredProcedure(action, approvalData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (approvalData.SalesRFQID) request.input('SalesRFQID', sql.Int, parseInt(approvalData.SalesRFQID));
      if (approvalData.ApproverID) request.input('ApproverID', sql.Int, parseInt(approvalData.ApproverID));
      if (approvalData.ApprovedYN != null) request.input('ApprovedYN', sql.Bit, approvalData.ApprovedYN);
      if (approvalData.DeletedByID) request.input('DeletedByID', sql.Int, parseInt(approvalData.DeletedByID));
      request.input('FormName', sql.NVarChar(100), approvalData.FormName || '');
      request.input('RoleName', sql.NVarChar(100), approvalData.RoleName || '');
      request.input('UserID', sql.Int, parseInt(approvalData.UserID) || 1);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageSalesRFQApproval');

      return {
        success: result.output.Result === 0,
        message: result.output.Message,
        data: action === 'SELECT' ? result.recordset || [] : null,
        salesRFQId: approvalData.SalesRFQID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #executeGetAllStoredProcedure(salesRFQID, pageNumber, pageSize) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      if (salesRFQID) request.input('SalesRFQID', sql.Int, parseInt(salesRFQID));
      request.input('PageNumber', sql.Int, parseInt(pageNumber) || 1);
      request.input('PageSize', sql.Int, parseInt(pageSize) || 10);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(255));

      const result = await request.execute('SP_GetAllSalesRFQApprovals');

      return {
        success: result.output.Result === 0,
        message: result.output.Message,
        data: result.recordset || [],
        salesRFQId: salesRFQID
      };
    } catch (error) {
      console.error('Database error in GetAllSalesRFQApprovals:', error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(approvalData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT') {
      if (approvalData.SalesRFQID) {
        const check = await pool.request()
          .input('SalesRFQID', sql.Int, approvalData.SalesRFQID)
          .query('SELECT 1 FROM [dbo].[tblSalesRFQ] WHERE SalesRFQID = @SalesRFQID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (check.recordset.length === 0) errors.push(`SalesRFQID ${approvalData.SalesRFQID} does not exist or is deleted`);
      }
      if (approvalData.ApproverID) {
        const check = await pool.request()
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @ApproverID');
        if (check.recordset.length === 0) errors.push(`ApproverID ${approvalData.ApproverID} does not exist`);
      }
      if (approvalData.UserID) {
        const check = await pool.request()
          .input('UserID', sql.Int, approvalData.UserID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @UserID');
        if (check.recordset.length === 0) errors.push(`UserID ${approvalData.UserID} does not exist`);
      }
    }

    if (action === 'UPDATE') {
      if (approvalData.SalesRFQID && approvalData.ApproverID) {
        const check = await pool.request()
          .input('SalesRFQID', sql.Int, approvalData.SalesRFQID)
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblSalesRFQApproval] WHERE SalesRFQID = @SalesRFQID AND ApproverID = @ApproverID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (check.recordset.length === 0) errors.push(`Approval record for SalesRFQID ${approvalData.SalesRFQID} and ApproverID ${approvalData.ApproverID} does not exist or is deleted`);
      }
      if (approvalData.ApproverID) {
        const check = await pool.request()
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @ApproverID');
        if (check.recordset.length === 0) errors.push(`ApproverID ${approvalData.ApproverID} does not exist`);
      }
      if (approvalData.UserID) {
        const check = await pool.request()
          .input('UserID', sql.Int, approvalData.UserID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @UserID');
        if (check.recordset.length === 0) errors.push(`UserID ${approvalData.UserID} does not exist`);
      }
    }

    if (action === 'DELETE') {
      if (approvalData.SalesRFQID && approvalData.ApproverID) {
        const check = await pool.request()
          .input('SalesRFQID', sql.Int, approvalData.SalesRFQID)
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblSalesRFQApproval] WHERE SalesRFQID = @SalesRFQID AND ApproverID = @ApproverID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (check.recordset.length === 0) errors.push(`Approval record for SalesRFQID ${approvalData.SalesRFQID} and ApproverID ${approvalData.ApproverID} does not exist or is deleted`);
      }
      if (approvalData.DeletedByID) {
        const check = await pool.request()
          .input('DeletedByID', sql.Int, approvalData.DeletedByID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @DeletedByID');
        if (check.recordset.length === 0) errors.push(`DeletedByID ${approvalData.DeletedByID} does not exist`);
      }
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async createSalesRFQApproval(approvalData) {
    const requiredFields = ['SalesRFQID', 'ApproverID', 'FormName', 'RoleName', 'UserID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'INSERT');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    return await this.#executeManageStoredProcedure('INSERT', approvalData);
  }

  static async updateSalesRFQApproval(approvalData) {
    const requiredFields = ['SalesRFQID', 'ApproverID', 'FormName', 'RoleName', 'UserID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    return await this.#executeManageStoredProcedure('UPDATE', approvalData);
  }

  static async deleteSalesRFQApproval(approvalData) {
    const requiredFields = ['SalesRFQID', 'ApproverID', 'DeletedByID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    return await this.#executeManageStoredProcedure('DELETE', approvalData);
  }

  static async getSalesRFQApproval(approvalData) {
    const requiredFields = ['SalesRFQID', 'ApproverID'];
    const missingFields = requiredFields.filter(field => !approvalData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesRFQId: approvalData.SalesRFQID
      };
    }

    return await this.#executeManageStoredProcedure('SELECT', approvalData);
  }

  static async getAllSalesRFQApprovals() {
    return await this.#executeManageStoredProcedure('SELECT', {});
  }

  static async getPaginatedSalesRFQApprovals(salesRFQID, pageNumber, pageSize) {
    return await this.#executeGetAllStoredProcedure(salesRFQID, pageNumber, pageSize);
  }
}

module.exports = SalesRFQApprovalModel;