const sql = require('mssql');
const poolPromise = require('../config/db.config');

class FormRoleApproverModel {
  async getAllFormRoleApprovers(params) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('PageNumber', sql.Int, params.PageNumber || 1);
      request.input('PageSize', sql.Int, params.PageSize || 10);
      request.input('FormRoleID', sql.Int, params.FormRoleID || null);
      request.input('UserID', sql.Int, params.UserID || null);
      request.input('ActiveOnly', sql.Bit, params.ActiveOnly !== undefined ? params.ActiveOnly : null);
      request.input('CreatedBy', sql.NVarChar(128), params.CreatedBy || null);

      // Output parameter
      request.output('TotalRecords', sql.Int);

      const result = await request.execute('SP_GetAllFormRoleApprovers');

      return {
        success: true,
        data: result.recordset,
        totalRecords: result.output.TotalRecords,
        pageNumber: params.PageNumber || 1,
        pageSize: params.PageSize || 10
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async executeStoredProcedure(action, params) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('Action', sql.NVarChar(10), action);
      if (params.FormRoleApproverID) request.input('FormRoleApproverID', sql.Int, params.FormRoleApproverID);
      if (params.FormRoleID) request.input('FormRoleID', sql.Int, params.FormRoleID);
      if (params.UserID) request.input('UserID', sql.Int, params.UserID);
      if (params.ActiveYN !== undefined) request.input('ActiveYN', sql.Bit, params.ActiveYN);
      if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageFormRoleApprover');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: result.recordset
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async create(formRoleApprover) {
    return this.executeStoredProcedure('INSERT', formRoleApprover);
  }

  async update(formRoleApprover) {
    return this.executeStoredProcedure('UPDATE', formRoleApprover);
  }

  async delete(formRoleApproverID, createdByID) {
    return this.executeStoredProcedure('DELETE', { FormRoleApproverID: formRoleApproverID, CreatedByID: createdByID });
  }

  async getById(formRoleApproverID) {
    return this.executeStoredProcedure('SELECT', { FormRoleApproverID: formRoleApproverID });
  }
}

module.exports = new FormRoleApproverModel();