const poolPromise = require('../config/db.config');

class PersonModel {
  // Get paginated persons
  static async getAllPersons({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      console.log('getAllPersons params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_GetAllPerson(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getAllPersons results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getAllPersons output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_GetAllPerson: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve persons');
      }

      return {
        data: results[0] || [],
        totalRecords: results[1][0]?.TotalRecords || 0
      };
    } catch (err) {
      console.error('getAllPersons error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new person
  static async createPerson(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_PersonID
        data.firstName,
        data.middleName,
        data.lastName,
        data.roleId,
        data.status,
        data.salutation,
        data.designation,
        data.gender,
        data.dob ? new Date(data.dob) : null,
        data.joiningDate ? new Date(data.joiningDate) : null,
        data.companyId,
        data.isExternal ? 1 : 0,
        data.loginId,
        data.password,
        data.emailId,
        data.isDarkMode ? 1 : 0,
        data.createdById
      ];

      console.log('createPerson params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('createPerson results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('createPerson output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManagePerson: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create person');
      }

      return {
        personId: results[0]?.PersonID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createPerson error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single person by ID
  static async getPersonById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_FirstName
        null, // p_MiddleName
        null, // p_LastName
        null, // p_RoleID
        null, // p_Status
        null, // p_Salutation
        null, // p_Designation
        null, // p_Gender
        null, // p_DOB
        null, // p_JoiningDate
        null, // p_CompanyID
        null, // p_IsExternal
        null, // p_LoginID
        null, // p_Password
        null, // p_EmailID
        null, // p_IsDarkMode
        null  // p_CreatedByID
      ];

      console.log('getPersonById params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('getPersonById results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('getPersonById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManagePerson: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Person not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getPersonById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a person
  static async updatePerson(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.firstName,
        data.middleName,
        data.lastName,
        data.roleId,
        data.status,
        data.salutation,
        data.designation,
        data.gender,
        data.dob ? new Date(data.dob) : null,
        data.joiningDate ? new Date(data.joiningDate) : null,
        data.companyId,
        data.isExternal ? 1 : 0,
        data.loginId,
        data.password,
        data.emailId,
        data.isDarkMode ? 1 : 0,
        data.createdById
      ];

      console.log('updatePerson params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('updatePerson results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('updatePerson output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManagePerson: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update person');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updatePerson error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a person
  static async deletePerson(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_FirstName
        null, // p_MiddleName
        null, // p_LastName
        null, // p_RoleID
        null, // p_Status
        null, // p_Salutation
        null, // p_Designation
        null, // p_Gender
        null, // p_DOB
        null, // p_JoiningDate
        null, // p_CompanyID
        null, // p_IsExternal
        null, // p_LoginID
        null, // p_Password
        null, // p_EmailID
        null, // p_IsDarkMode
        createdById
      ];

      console.log('deletePerson params:', JSON.stringify(queryParams, null, 2));

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('deletePerson results:', JSON.stringify(results, null, 2));

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      console.log('deletePerson output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManagePerson: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete person');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deletePerson error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = PersonModel;