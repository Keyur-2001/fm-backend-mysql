<<<<<<< HEAD
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
=======
const poolPromise = require('../config/db.config');

class FormRoleModel {
  static async getAllFormRoles({ pageNumber = 1, pageSize = 10 }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10
      ];

      console.log('getAllFormRoles params:', queryParams);

      const [results] = await pool.query(
        'CALL SP_GetAllFormRoles(?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllFormRoles results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllFormRoles output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllFormRoles');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve FormRoles');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1] && results[1][0] ? results[1][0].TotalRecords : 0
      };
    } catch (err) {
      console.error('getAllFormRoles error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async createFormRole(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_FormRoleID
        data.formId,
        data.roleId,
        data.readOnly,
        data.writes,
        null // p_CreatedByID
      ];

      console.log('createFormRole params:', queryParams);

      await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_FormRoleID AS p_FormRoleID');

      console.log('createFormRole output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageFormRole');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create FormRole');
      }

      return {
        formRoleId: output[0].p_FormRoleID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createFormRole error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async getFormRoleById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_FormID
        null, // p_RoleID
        null, // p_ReadOnly
        null, // p_Writes
        null // p_CreatedByID
      ];

      console.log('getFormRoleById params:', queryParams);

      const [results] = await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getFormRoleById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getFormRoleById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageFormRole');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'FormRole not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getFormRoleById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateFormRole(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.formId,
        data.roleId,
        data.readOnly,
        data.writes,
        data.createdById
      ];

      console.log('updateFormRole params:', queryParams);

      await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updateFormRole output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageFormRole');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update FormRole');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateFormRole error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async deleteFormRole(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_FormID
        null, // p_RoleID
        null, // p_ReadOnly
        null, // p_Writes
        createdById
      ];

      console.log('deleteFormRole params:', queryParams);

      await pool.query(
        'CALL SP_ManageFormRole(?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deleteFormRole output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageFormRole');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete FormRole');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteFormRole error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = FormRoleModel;
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
