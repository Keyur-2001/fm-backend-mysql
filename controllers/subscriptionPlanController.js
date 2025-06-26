const SubscriptionPlanModel = require('../models/subscriptionPlanModel');

class SubscriptionPlanController {
  static async getAllSubscriptionPlans(req, res) {
    try {
      const { pageNumber = 1, pageSize = 10, fromDate, toDate } = req.query;

      // Validate pagination parameters
      const pageNum = parseInt(pageNumber, 10);
      const pageSz = parseInt(pageSize, 10);
      if (isNaN(pageNum) || pageNum < 1 || isNaN(pageSz) || pageSz < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pageNumber or pageSize',
          data: null,
          totalRecords: 0
        });
      }

      // Validate date parameters
      if (fromDate && !/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fromDate format (use YYYY-MM-DD)',
          data: null,
          totalRecords: 0
        });
      }
      if (toDate && !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid toDate format (use YYYY-MM-DD)',
          data: null,
          totalRecords: 0
        });
      }

      const subscriptionPlans = await SubscriptionPlanModel.getAllSubscriptionPlans({
        pageNumber: pageNum,
        pageSize: pageSz,
        fromDate,
        toDate
      });

      return res.status(200).json({
        success: true,
        message: 'Subscription plans retrieved successfully',
        data: subscriptionPlans.data || [],
        totalRecords: subscriptionPlans.totalRecords || 0
      });
    } catch (err) {
      console.error('getAllSubscriptionPlans error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async createSubscriptionPlan(req, res) {
    try {
      const { subscriptionPlanName, description, fees, billingFrequencyId, createdById } = req.body;

      // Validate input
      if (!subscriptionPlanName || typeof subscriptionPlanName !== 'string' || subscriptionPlanName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanName is required',
          data: null,
          totalRecords: 0
        });
      }
      if (fees == null || isNaN(parseFloat(fees)) || parseFloat(fees) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid Fees (non-negative number) is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!billingFrequencyId || isNaN(parseInt(billingFrequencyId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid BillingFrequencyID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!createdById || isNaN(parseInt(createdById))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CreatedByID is required',
          data: null,
          totalRecords: 0
        });
      }

      const data = {
        subscriptionPlanName: subscriptionPlanName.trim(),
        description: description || null,
        fees: parseFloat(fees),
        billingFrequencyId: parseInt(billingFrequencyId),
        createdById: parseInt(createdById)
      };

      console.log('Creating subscription plan with data:', JSON.stringify(data, null, 2));
      const result = await SubscriptionPlanModel.createSubscriptionPlan(data);
      console.log('Create subscription plan result:', JSON.stringify(result, null, 2));

      if (!result || !result.subscriptionPlanId) {
        throw new Error('Failed to create subscription plan: Invalid response from model');
      }

      return res.status(201).json({
        success: true,
        message: result.message || 'Subscription plan created successfully',
        data: data,
        totalRecords: 0
      });
    } catch (err) {
      console.error('createSubscriptionPlan error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async getSubscriptionPlanById(req, res) {
    try {
      const { id } = req.params;

      const subscriptionPlanId = parseInt(id, 10);
      if (!id || isNaN(subscriptionPlanId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanID is required',
          data: null,
          totalRecords: 0
        });
      }

      const subscriptionPlan = await SubscriptionPlanModel.getSubscriptionPlanById(subscriptionPlanId);

      if (!subscriptionPlan) {
        return res.status(404).json({
          success: false,
          message: 'Subscription plan not found',
          data: null,
          totalRecords: 0
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Subscription plan retrieved successfully',
        data: subscriptionPlan,
        totalRecords: 1
      });
    } catch (err) {
      console.error('getSubscriptionPlanById error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async updateSubscriptionPlan(req, res) {
    try {
      const { id } = req.params;
      const { subscriptionPlanName, description, fees, billingFrequencyId, createdById } = req.body;

      const subscriptionPlanId = parseInt(id, 10);
      if (!id || isNaN(subscriptionPlanId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanID is required',
          data: null,
          totalRecords: 0
        });
      }

      if (!subscriptionPlanName || typeof subscriptionPlanName !== 'string' || subscriptionPlanName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanName is required',
          data: null,
          totalRecords: 0
        });
      }
      if (fees == null || isNaN(parseFloat(fees)) || parseFloat(fees) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid Fees (non-negative number) is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!billingFrequencyId || isNaN(parseInt(billingFrequencyId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid BillingFrequencyID is required',
          data: null,
          totalRecords: 0
        });
      }
      if (!createdById || isNaN(parseInt(createdById))) {
        return res.status(400).json({
          success: false,
          message: 'Valid CreatedByID is required',
          data: null,
          totalRecords: 0
        });
      }

      const data = {
        subscriptionPlanName: subscriptionPlanName.trim(),
        description: description || null,
        fees: parseFloat(fees),
        billingFrequencyId: parseInt(billingFrequencyId),
        createdById: parseInt(createdById)
      };

      console.log('Updating subscription plan with id:', subscriptionPlanId, 'and data:', JSON.stringify(data, null, 2));
      const result = await SubscriptionPlanModel.updateSubscriptionPlan(subscriptionPlanId, data);
      console.log('Update subscription plan result:', JSON.stringify(result, null, 2));

      if (!result) {
        throw new Error('Invalid response from SubscriptionPlanModel');
      }

      return res.status(200).json({
        success: true,
        message: result.message || 'Subscription plan updated successfully',
        data: null,
        totalRecords: 0
      });
    } catch (err) {
      console.error('updateSubscriptionPlan error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }

  static async deleteSubscriptionPlan(req, res) {
    try {
      const { id } = req.params;
      const { deletedById } = req.body;

      const subscriptionPlanId = parseInt(id, 10);
      if (!id || isNaN(subscriptionPlanId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanID is required',
          data: null,
          totalRecords: 0
        });
      }

      if (!deletedById || isNaN(parseInt(deletedById))) {
        return res.status(400).json({
          success: false,
          message: 'Valid DeletedByID is required',
          data: null,
          totalRecords: 0
        });
      }

      console.log('Deleting subscription plan with id:', subscriptionPlanId, 'by deletedById:', deletedById);
      const result = await SubscriptionPlanModel.deleteSubscriptionPlan(subscriptionPlanId, parseInt(deletedById));
      console.log('Delete subscription plan result:', JSON.stringify(result, null, 2));

      return res.status(200).json({
        success: true,
        message: result.message || 'Subscription plan deleted successfully',
        data: null,
        totalRecords: 0
      });
    } catch (err) {
      console.error('deleteSubscriptionPlan error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        totalRecords: 0
      });
    }
  }
}

module.exports = SubscriptionPlanController;