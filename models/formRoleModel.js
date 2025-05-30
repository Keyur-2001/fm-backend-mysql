const sql = require('mssql');
const poolPromise = require('../config/db.config');

class FormRoleModel {
  async getAllFormRoles(params) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Input parameters
      request.input('PageNumber', sql.Int, params.PageNumber || 1);
      request.input('PageSize', sql.Int, params.PageSize || 10);
      request.input('FromDate', sql.Date, params.FromDate || null);
      request.input('ToDate', sql.Date, params.ToDate || null);
      request.input('FormID', sql.Int, params.FormID || null);
      request.input('RoleID', sql.Int, params.RoleID || null);
      request.input('DateField', sql.NVarChar(50), params.DateField || 'CreatedDateTime');
      request.input('CreatedBy', sql.NVarChar(128), params.CreatedBy || null);

      // Output parameter
      request.output('TotalRecords', sql.Int);

      const result = await request.execute('SP_GetAllFormRoles');

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
      if (params.FormRoleID) request.input('FormRoleID', sql.Int, params.FormRoleID);
      if (params.FormID) request.input('FormID', sql.Int, params.FormID);
      if (params.RoleID) request.input('RoleID', sql.Int, params.RoleID);
      if (params.ReadOnly !== undefined) request.input('ReadOnly', sql.Bit, params.ReadOnly);
      if (params.Write !== undefined) request.input('Write', sql.Bit, params.Write);
      if (params.CreatedByID) request.input('CreatedByID', sql.Int, params.CreatedByID);

      // Output parameters
      request.output('Result', sql.Int);
      request.output('Message', sql.NVarChar(500));

      const result = await request.execute('SP_ManageFormRole');

      return {
        success: result.output.Result === 1,
        message: result.output.Message,
        data: result.recordset,
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async create(formRole) {
    return this.executeStoredProcedure('INSERT', formRole);
  }

  async update(formRole) {
    return this.executeStoredProcedure('UPDATE', formRole);
  }

  async delete(formRoleID, createdByID) {
    return this.executeStoredProcedure('DELETE', { FormRoleID: formRoleID, CreatedByID: createdByID });
  }

  async getById(formRoleID) {
    return this.executeStoredProcedure('SELECT', { FormRoleID: formRoleID });
  }
}

module.exports = new FormRoleModel();