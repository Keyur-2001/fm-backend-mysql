const poolPromise = require('../config/db.config');

class SubscriptionPlanModel {
  // Get paginated Subscription Plans
  static async getAllSubscriptionPlans({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT ALL',
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      console.log('getAllSubscriptionPlans params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?)',
        queryParams
      );

      console.log('getAllSubscriptionPlans results:', JSON.stringify(results, null, 2));

      return {
        data: results[0] || [],
        totalRecords: results[1] && results[1][0] ? results[1][0].TotalRecords : 0
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

      if (!data.SubscriptionPlanName || data.Fees == null || !data.BillingFrequencyID || !data.CreatedByID) {
        throw new Error('SubscriptionPlanName, Fees, BillingFrequencyID, and CreatedByID are required');
      }

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
      console.log('createSubscriptionPlan params:', queryParams);

      // Call SP_ManageSubscriptionPlan with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Fetch output parameters, including p_SubscriptionPlanID
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_SubscriptionPlanID AS p_SubscriptionPlanID');

      // Log output
      console.log('createSubscriptionPlan output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSubscriptionPlan');
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageSubscriptionPlan result: ${JSON.stringify(results)}`);
      }

      return {
        subscriptionPlanId: output[0].p_SubscriptionPlanID || null,
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createSubscriptionPlan error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Subscription Plan by ID
  static async getSubscriptionPlanById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = ['SELECT', parseInt(id), null, null, null, null, null];

      // Log query parameters
      console.log('getSubscriptionPlanById params:', queryParams);

      // Call SP_ManageSubscriptionPlan with session variables for OUT parameters
      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      // Log results
      console.log('getSubscriptionPlanById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getSubscriptionPlanById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSubscriptionPlan');
      }

      if (output[0].p_Result !== 0) {
        throw new Error(output[0].p_Message || 'Subscription Plan not found');
      }

      return dataResult || null;
    } catch (err) {
      console.error('getSubscriptionPlanById error:', err);
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
      console.log('updateSubscriptionPlan params:', queryParams);

      // Call SP_ManageSubscriptionPlan with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('updateSubscriptionPlan results:', JSON.stringify(results, null, 2));

      // Log output
      console.log('updateSubscriptionPlan output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSubscriptionPlan');
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageSubscriptionPlan result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to update Subscription Plan');
      }

      return {
        message: statusResult.Message
      };
    } catch (err) {
      console.error('updateSubscriptionPlan error:', err);
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
      console.log('deleteSubscriptionPlan params:', queryParams);

      // Call SP_ManageSubscriptionPlan with session variables for OUT parameters
      await pool.query(
        'CALL SP_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      console.log('deleteSubscriptionPlan results:', JSON.stringify(results, null, 2));

      // Log output
      console.log('deleteSubscriptionPlan output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSubscriptionPlan');
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageSubscriptionPlan result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to delete Subscription Plan');
      }

      return {
        message: statusResult.Message
      };
    } catch (err) {
      console.error('deleteSubscriptionPlan error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SubscriptionPlanModel;