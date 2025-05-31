const poolPromise = require('../config/db.config');

class PersonModel {
  // Get paginated Persons
  static async getAllPersons({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

<<<<<<< HEAD
=======
      // Log query parameters
      console.log('getAllPersons params:', queryParams);

      // Call SP_GetAllPerson
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      const [results] = await pool.query(
        'CALL SP_GetAllPerson(?, ?, ?, ?)',
        queryParams
      );

<<<<<<< HEAD
      return {
        data: results[0] || [], // First result set: paginated data
        totalRecords: results[1][0]?.TotalRecords || 0 // Second result set: total count
=======
      // Log results
      console.log('getAllPersons results:', JSON.stringify(results, null, 2));

      return {
        data: results[0] || [],
        totalRecords: results[1] && results[1][0] ? results[1][0].TotalRecords : 0
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      };
    } catch (err) {
      console.error('getAllPersons error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

<<<<<<< HEAD

  // Create a new person
=======
  // Create a new Person
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
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
        data.isExternal,
        data.loginId,
        data.password,
        data.emailId,
<<<<<<< HEAD
        data.isDarkMode ? 1 : 0,
        data.createdById,
        data.profileImage || null // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

=======
        data.isDarkMode,
        data.createdById
      ];

      // Log query parameters
      console.log('createPerson params:', queryParams);

      // Call SP_ManagePerson with session variables for OUT/INOUT parameters
      await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters, including p_PersonID
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_PersonID AS p_PersonID');

      // Log output
      console.log('createPerson output:', JSON.stringify(output, null, 2));

>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManagePerson');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Person');
      }

      return {
        personId: output[0].p_PersonID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createPerson error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Person by ID
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

<<<<<<< HEAD
=======
      // Log query parameters
      console.log('getPersonById params:', queryParams);

      // Call SP_ManagePerson with session variables for OUT/INOUT parameters
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

<<<<<<< HEAD
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

=======
      // Log results
      console.log('getPersonById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getPersonById output:', JSON.stringify(output, null, 2));

>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManagePerson');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Person not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getPersonById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Person
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
        data.isExternal,
        data.loginId,
        data.password,
        data.emailId,
<<<<<<< HEAD
        data.isDarkMode ? 1 : 0,
        data.createdById,
        data.profileImage || null // p_ProfileImage
      ];

      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

=======
        data.isDarkMode,
        data.createdById
      ];

      // Log query parameters
      console.log('updatePerson params:', queryParams);

      // Call SP_ManagePerson with session variables for OUT/INOUT parameters
      await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updatePerson output:', JSON.stringify(output, null, 2));

>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManagePerson');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Person');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updatePerson error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Person
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

<<<<<<< HEAD
      const [results] = await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

=======
      // Log query parameters
      console.log('deletePerson params:', queryParams);

      // Call SP_ManagePerson with session variables for OUT/INOUT parameters
      await pool.query(
        'CALL SP_ManagePerson(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deletePerson output:', JSON.stringify(output, null, 2));

>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManagePerson');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Person');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deletePerson error:', err);
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