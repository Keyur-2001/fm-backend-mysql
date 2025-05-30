const sql = require('mssql');
const poolPromise = require('../config/db.config');

class SupplierQuotationApprovalModel {
  static async #executeManageStoredProcedure(action, approvalData) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (approvalData.SupplierQuotationID) request.input('SupplierQuotationID', sql.Int, parseInt(approvalData.SupplierQuotationID));
      if (approvalData.ApproverID) request.input('ApproverID', sql.Int, parseInt(approvalData.ApproverID));
      if (approvalData.ApprovedYN != null) request.input('ApprovedYN', sql.Bit, approvalData.ApprovedYN);
      request.input('FormName', sql.NVarChar(100), approvalData.FormName || '');
      request.input('RoleName', sql.NVarChar(100), approvalData.RoleName || '');
      request.input('UserID', sql.Int, parseInt(approvalData.UserID) || 1);
      if (approvalData.CreatedByID) request.input('CreatedByID', sql.Int, parseInt(approvalData.CreatedByID));
      if (approvalData.DeletedByID) request.input('DeletedByID', sql.Int, parseInt(approvalData.DeletedByID));

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageSupplierQuotationApproval');

      return {
        success: result.output.Result === 0,
        message: result.output.Message,
        data: action === 'SELECT' ? result.recordset || [] : null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(approvalData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT') {
      if (approvalData.SupplierQuotationID) {
        const check = await pool.request()
          .input('SupplierQuotationID', sql.Int, approvalData.SupplierQuotationID)
          .query('SELECT 1 FROM [dbo].[tblSupplierQuotation] WHERE SupplierQuotationID = @SupplierQuotationID AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (check.recordset.length === 0) errors.push(`SupplierQuotationID ${approvalData.SupplierQuotationID} does not exist or is deleted`);
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
      if (approvalData.CreatedByID) {
        const check = await pool.request()
          .input('CreatedByID', sql.Int, approvalData.CreatedByID)
          .query('SELECT 1 FROM [dbo].[tblPerson] WHERE PersonID = @CreatedByID');
        if (check.recordset.length === 0) errors.push(`CreatedByID ${approvalData.CreatedByID} does not exist`);
      }
      if (approvalData.FormName) {
        const check = await pool.request()
          .input('FormName', sql.NVarChar(100), approvalData.FormName)
          .query('SELECT 1 FROM [dbo].[tblForm] WHERE FormName = @FormName AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (check.recordset.length === 0) errors.push(`FormName ${approvalData.FormName} does not exist or is deleted`);
      }
      if (approvalData.RoleName) {
        const check = await pool.request()
          .input('RoleName', sql.NVarChar(100), approvalData.RoleName)
          .query('SELECT 1 FROM [dbo].[tblRoles] WHERE RoleName = @RoleName');
        if (check.recordset.length === 0) errors.push(`RoleName ${approvalData.RoleName} does not exist`);
      }
    }

    if (action === 'UPDATE') {
      if (approvalData.SupplierQuotationID && approvalData.ApproverID) {
        const check = await pool.request()
          .input('SupplierQuotationID', sql.Int, approvalData.SupplierQuotationID)
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblSupplierQuotationApproval] WHERE SupplierQuotationID = @SupplierQuotationID AND ApproverID = @ApproverID');
        if (check.recordset.length === 0) errors.push(`Approval record for SupplierQuotationID ${approvalData.SupplierQuotationID} and ApproverID ${approvalData.ApproverID} does not exist`);
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
      if (approvalData.FormName) {
        const check = await pool.request()
          .input('FormName', sql.NVarChar(100), approvalData.FormName)
          .query('SELECT 1 FROM [dbo].[tblForm] WHERE FormName = @FormName AND (IsDeleted = 0 OR IsDeleted IS NULL)');
        if (check.recordset.length === 0) errors.push(`FormName ${approvalData.FormName} does not exist or is deleted`);
      }
      if (approvalData.RoleName) {
        const check = await pool.request()
          .input('RoleName', sql.NVarChar(100), approvalData.RoleName)
          .query('SELECT 1 FROM [dbo].[tblRoles] WHERE RoleName = @RoleName');
        if (check.recordset.length === 0) errors.push(`RoleName ${approvalData.RoleName} does not exist`);
      }
    }

    if (action === 'DELETE') {
      if (approvalData.SupplierQuotationID && approvalData.ApproverID) {
        const check = await pool.request()
          .input('SupplierQuotationID', sql.Int, approvalData.SupplierQuotationID)
          .input('ApproverID', sql.Int, approvalData.ApproverID)
          .query('SELECT 1 FROM [dbo].[tblSupplierQuotationApproval] WHERE SupplierQuotationID = @SupplierQuotationID AND ApproverID = @ApproverID');
        if (check.recordset.length === 0) errors.push(`Approval record for SupplierQuotationID ${approvalData.SupplierQuotationID} and ApproverID ${approvalData.ApproverID} does not exist`);
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

  static async createSupplierQuotationApproval(approvalData) {
    const requiredFields = ['SupplierQuotationID', 'ApproverID', 'ApprovedYN', 'FormName', 'RoleName', 'UserID', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => approvalData[field] == null);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'INSERT');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('INSERT', approvalData);
  }

  static async updateSupplierQuotationApproval(approvalData) {
    const requiredFields = ['SupplierQuotationID', 'ApproverID', 'ApprovedYN', 'FormName', 'RoleName', 'UserID'];
    const missingFields = requiredFields.filter(field => approvalData[field] == null);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('UPDATE', approvalData);
  }

  static async deleteSupplierQuotationApproval(approvalData) {
    const requiredFields = ['SupplierQuotationID', 'ApproverID', 'DeletedByID'];
    const missingFields = requiredFields.filter(field => approvalData[field] == null);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    const fkErrors = await this.#validateForeignKeys(approvalData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('DELETE', approvalData);
  }

  static async getSupplierQuotationApproval(approvalData) {
    const requiredFields = ['SupplierQuotationID', 'ApproverID'];
    const missingFields = requiredFields.filter(field => approvalData[field] == null);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        supplierQuotationId: approvalData.SupplierQuotationID
      };
    }

    return await this.#executeManageStoredProcedure('SELECT', approvalData);
  }

  static async getAllSupplierQuotationApprovals(approvalData) {
    return await this.#executeManageStoredProcedure('SELECT', approvalData || {});
  }
}

module.exports = SupplierQuotationApprovalModel;