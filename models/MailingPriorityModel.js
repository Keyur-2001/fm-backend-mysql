const poolPromise = require('../config/db.config');

class MailingPriorityModel {
  // Get paginated Mailing Priorities
  static async getAllMailingPriorities({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Log query parameters
      console.log('getAllMailingPriorities params:', queryParams);

      // Call SP_GetAllMailingPriority with session variables for OUT parameters
      const [results] = await pool.query(
        'CALL SP_GetAllMailingPriority(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAllMailingPriorities results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getAllMailingPriorities output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllMailingPriority');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve Mailing Priorities');
      }

      return {
        data: results[0] || [],
        totalRecords: null // SP does not return total count
      };
    } catch (err) {
      console.error('getAllMailingPriorities error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Mailing Priority
  static async createMailingPriority(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_MailingPriorityID
        data.priorityName,
        data.priorityDescription,
        data.createdById
      ];

      // Log query parameters
      console.log('createMailingPriority params:', queryParams);

      // Call SP_ManageMailingPriority with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageMailingPriority(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters, including p_MailingPriorityID
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_MailingPriorityID AS p_MailingPriorityID');

      // Log output
      console.log('createMailingPriority output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageMailingPriority');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Mailing Priority');
      }

      return {
        mailingPriorityId: output[0].p_MailingPriorityID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createMailingPriority error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Mailing Priority by ID
  static async getMailingPriorityById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_PriorityName
        null, // p_PriorityDescription
        null  // p_CreatedByID
      ];

      // Log query parameters
      console.log('getMailingPriorityById params:', queryParams);

      // Call SP_ManageMailingPriority with session variables for OUT parameters
      const [results] = await pool.query(
        'CALL SP_ManageMailingPriority(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getMailingPriorityById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getMailingPriorityById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageMailingPriority');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Mailing Priority not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getMailingPriorityById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Mailing Priority
  static async updateMailingPriority(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.priorityName,
        data.priorityDescription,
        data.createdById
      ];

      // Log query parameters
      console.log('updateMailingPriority params:', queryParams);

      // Call SP_ManageMailingPriority with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageMailingPriority(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateMailingPriority output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageMailingPriority');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Mailing Priority');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateMailingPriority error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

 // Delete a Mailing Priority
static async deleteMailingPriority(id, createdById) {
    try {
      const pool = await poolPromise;
  
      const queryParams = [
        'DELETE',
        id,
        null, // p_PriorityName
        null, // p_PriorityDescription
        createdById
      ];
  
      // Log query parameters
      console.log('deleteMailingPriority params:', queryParams);
  
      // Call SP_ManageMailingPriority with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageMailingPriority(?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );
  
      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');
  
      // Log output
      console.log('deleteMailingPriority output:', JSON.stringify(output, null, 2));
  
      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageMailingPriority');
      }
  
      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Mailing Priority');
      }
  
      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteMailingPriority error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = MailingPriorityModel;