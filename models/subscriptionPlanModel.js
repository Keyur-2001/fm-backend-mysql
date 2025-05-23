const poolPromise = require('../config/db.config');

class SubscriptionPlanModel {
  // Get paginated Subscription Plans
  static async getAllSubscriptionPlans({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
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
      console.log('getAllSubscriptionPlans params:', queryParams);

      // Call SP_GetAllSubscriptionPlans
      const [results] = await pool.query(
        'CALL SP_GetAllSubscriptionPlans(?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('getAllSubscriptionPlans results:', JSON.stringify(results, null, 2));

      if (!results || results.length < 2) {
        throw new Error(`Unexpected result format from SP_GetAllSubscriptionPlans: ${JSON.stringify(results)}`);
      }

      return {
        data: results[0] || [],
        totalRecords: results[1][0]?.TotalRecords || 0
      };
    } catch (err) {
      console.error('getAllSubscriptionPlans error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Subscription Plan
  static async createSubscriptionPlan(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_SubscriptionPlanID
        data.subscriptionPlanName,
        data.description,
        data.fees,
        data.billingFrequencyId,
        data.createdById,
        null // p_DeletedByID
      ];

      // Log query parameters
      console.log('createSubscriptionPlan params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageSubscriptionPlan
      const [results] = await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('createSubscriptionPlan results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('createSubscriptionPlan output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageSubscriptionPlan: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to create Subscription Plan');
      }

      // Extract SubscriptionPlanID from message if available
      const match = output[0].p_Message.match(/ID: (\d+)/);
      const subscriptionPlanId = match ? parseInt(match[1]) : null;

      return {
        subscriptionPlanId,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createSubscriptionPlan error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Subscription Plan by ID
  static async getSubscriptionPlanById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_SubscriptionPlanName
        null, // p_Description
        null, // p_Fees
        null, // p_BillingFrequencyID
        null, // p_CreatedByID
        null  // p_DeletedByID
      ];

      // Log query parameters
      console.log('getSubscriptionPlanById params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageSubscriptionPlan
      const [results] = await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getSubscriptionPlanById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getSubscriptionPlanById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageSubscriptionPlan: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Subscription Plan not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getSubscriptionPlanById error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Subscription Plan
  static async updateSubscriptionPlan(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.subscriptionPlanName,
        data.description,
        data.fees,
        data.billingFrequencyId,
        data.createdById,
        null // p_DeletedByID
      ];

      // Log query parameters
      console.log('updateSubscriptionPlan params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageSubscriptionPlan
      const [results] = await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('updateSubscriptionPlan results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateSubscriptionPlan output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageSubscriptionPlan: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to update Subscription Plan');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateSubscriptionPlan error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Subscription Plan
  static async deleteSubscriptionPlan(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_SubscriptionPlanName
        null, // p_Description
        null, // p_Fees
        null, // p_BillingFrequencyID
        null, // p_CreatedByID
        deletedById
      ];

      // Log query parameters
      console.log('deleteSubscriptionPlan params:', JSON.stringify(queryParams, null, 2));

      // Call SP_ManageSubscriptionPlan
      const [results] = await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('deleteSubscriptionPlan results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deleteSubscriptionPlan output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error(`Output parameters missing from SP_ManageSubscriptionPlan: ${JSON.stringify(output)}`);
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Failed to delete Subscription Plan');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteSubscriptionPlan error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SubscriptionPlanModel;