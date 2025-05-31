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

      const [results] = await pool.query(
        'CALL SP_GetAllPerson(?, ?, ?, ?)',
        queryParams
      );

      return {
        data: results[0] || [], // First result set: paginated data
        totalRecords: results[1][0]?.TotalRecords || 0 // Second result set: total count
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
        data.createdById,
        data.profileImage || null // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

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
        null, // p_CreatedByID
        null // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

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
        data.createdById,
        data.profileImage || null // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

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
        createdById,
        null // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

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

  // Update person's profile image
  static async updateProfileImage({ personId, profileImage, createdById }) {
    try {
      const pool = await poolPromise;

      // Validate personId exists
      const [personCheck] = await pool.query(
        'SELECT 1 FROM dbo_tblperson WHERE PersonID = ? AND IsDeleted = 0',
        [parseInt(personId)]
      );
      if (personCheck.length === 0) {
        return {
          success: false,
          message: `PersonID ${personId} does not exist or is deleted`,
          data: null
        };
      }

      const queryParams = [
        'UPDATE',
        personId,
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
        createdById,
        profileImage // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        return {
          success: false,
          message: `Output parameters missing from SP_ManagePerson`,
          data: null
        };
      }

      if (output[0].p_Result !== 1) {
        return {
          success: false,
          message: output[0].p_Message || 'Failed to update profile image',
          data: null
        };
      }

      return {
        success: true,
        message: output[0].p_Message || 'Profile image updated successfully',
        data: null
      };
    } catch (err) {
      console.error('updateProfileImage error:', err.stack);
      return {
        success: false,
        message: `Database error: ${err.message}`,
        data: null
      };
    }
  }
}

module.exports = PersonModel;