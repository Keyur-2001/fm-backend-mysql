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
        fromDate ? new Date(fromDate).toISOString().split('T')[0] : null,
        toDate ? new Date(toDate).toISOString().split('T')[0] : null
      ];

      console.log('getAllSubscriptionPlans params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?)',
        queryParams
      );

      console.log('getAllSubscriptionPlans results:', JSON.stringify(results, null, 2));

      let dataResult = null;
      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet)) {
          if (resultSet[0] && 'SubscriptionPlanID' in resultSet[0]) {
            dataResult = resultSet;
          } else if (resultSet[0] && 'StatusCode' in resultSet[0]) {
            statusResult = resultSet[0];
          }
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageSubscriptionPlan result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to retrieve Subscription Plans');
      }

      return {
        data: dataResult || [],
        totalRecords: null // Adjust if SP returns count
      };
    } catch (err) {
      console.error('getAllSubscriptionPlans error:', err.stack);
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
        null,
        data.SubscriptionPlanName,
        data.Description,
        data.Fees,
        data.BillingFrequencyID,
        data.CreatedByID
      ];

      console.log('createSubscriptionPlan params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      console.log('createSubscriptionPlan results:', JSON.stringify(results, null, 2));

      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet) && resultSet[0] && 'StatusCode' in resultSet[0]) {
          statusResult = resultSet[0];
          break;
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageSubscriptionPlan result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Failed to create Subscription Plan');
      }

      const idMatch = statusResult.Message.match(/ID: (\d+)/);
      const subscriptionPlanId = idMatch ? parseInt(idMatch[1]) : null;

      return {
        subscriptionPlanId,
        message: statusResult.Message
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

      const queryParams = ['SELECT', parseInt(id), null, null, null, null, null];

      console.log('getSubscriptionPlanById params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      console.log('getSubscriptionPlanById results:', JSON.stringify(results, null, 2));

      let dataResult = null;
      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet)) {
          if (resultSet[0] && 'SubscriptionPlanID' in resultSet[0]) {
            dataResult = resultSet[0];
          } else if (resultSet[0] && 'StatusCode' in resultSet[0]) {
            statusResult = resultSet[0];
          }
        }
      }

      if (!statusResult || typeof statusResult.StatusCode === 'undefined') {
        throw new Error(`StatusCode missing in sp_ManageSubscriptionPlan result: ${JSON.stringify(results)}`);
      }

      if (statusResult.StatusCode !== 1) {
        throw new Error(statusResult.Message || 'Subscription Plan not found');
      }

      return dataResult || null;
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
        parseInt(id),
        data.SubscriptionPlanName,
        data.Description,
        data.Fees,
        data.BillingFrequencyID,
        data.CreatedByID,
        data.CreatedDateTime,
        data.IsDeleted,
        data.DeleteDateTime,
        data.deletedById,
        


      ];

      console.log('updateSubscriptionPlan params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?,?,?,?)',
        queryParams
      );

      console.log('updateSubscriptionPlan results:', JSON.stringify(results, null, 2));

      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet) && resultSet[0] && 'StatusCode' in resultSet[0]) {
          statusResult = resultSet[0];
          break;
        }
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
        parseInt(id),
        null,
        null,
        null,
        null,
        parseInt(deletedById)
      ];

      console.log('deleteSubscriptionPlan params:', queryParams);

      const [results] = await pool.query(
        'CALL sp_ManageSubscriptionPlan(?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      console.log('deleteSubscriptionPlan results:', JSON.stringify(results, null, 2));

      let statusResult = null;
      for (const resultSet of results) {
        if (Array.isArray(resultSet) && resultSet[0] && 'StatusCode' in resultSet[0]) {
          statusResult = resultSet[0];
          break;
        }
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
      console.error('deleteSubscriptionPlan error:', err.stack);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SubscriptionPlanModel;