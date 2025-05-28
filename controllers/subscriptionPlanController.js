const SubscriptionPlanModel = require('../models/subscriptionPlanModel');

class SubscriptionPlanController {
  // Get all Subscription Plans with pagination
  static async getAllSubscriptionPlans(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate } = req.query;

      // Sanitize inputs
      const pageNum = parseInt(pageNumber) || 1;
      const pageSz = parseInt(pageSize) || 10;

      if (pageNum < 1 || pageSz < 1) {
        return res.status(400).json({
          success: false,
          message: 'PageNumber and PageSize must be positive integers',
          data: null,
          subscriptionPlanId: null
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
        message: 'Subscription Plans retrieved successfully',
        data: subscriptionPlans.data,
        totalRecords: subscriptionPlans.totalRecords
      });
    } catch (err) {
      console.error('getAllSubscriptionPlans error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        subscriptionPlanId: null
      });
    }
  }

  // Create a new Subscription Plan
  static async createSubscriptionPlan(req, res) {
    try {
      const {
        SubscriptionPlanName,
        Description,
        Fees,
        BillingFrequencyID,
        CreatedByID
      } = req.body;

      // Basic validation
      if (!SubscriptionPlanName || Fees == null || !BillingFrequencyID || !CreatedByID) {
        return res.status(400).json({
          success: false,
          message: 'SubscriptionPlanName, Fees, BillingFrequencyID, and CreatedByID are required',
          data: null,
          subscriptionPlanId: null
        });
      }

      // Sanitize inputs
      const sanitizedData = {
        SubscriptionPlanName: String(SubscriptionPlanName).trim(),
        Description: Description ? String(Description).trim() : null,
        Fees: parseFloat(Fees),
        BillingFrequencyID: parseInt(BillingFrequencyID),
        CreatedByID: parseInt(CreatedByID)
      };

      if (isNaN(sanitizedData.Fees) || isNaN(sanitizedData.BillingFrequencyID) || isNaN(sanitizedData.CreatedByID)) {
        return res.status(400).json({
          success: false,
          message: 'Fees, BillingFrequencyID, and CreatedByID must be valid numbers',
          data: null,
          SubscriptionPlanID: null
        });
      }

      const result = await SubscriptionPlanModel.createSubscriptionPlan(sanitizedData);

      return res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        subscriptionPlanId: result.subscriptionPlanId
      });
    } catch (err) {
      console.error('createSubscriptionPlan error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        subscriptionPlanId: null
      });
    }
  }

  // Get a single Subscription Plan by ID
  static async getSubscriptionPlanById(req, res) {
    try {
      const { id } = req.params;

      const subscriptionPlanId = parseInt(id);
      if (!id || isNaN(subscriptionPlanId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanID is required',
          data: null,
          subscriptionPlanId: null
        });
      }

      const subscriptionPlan = await SubscriptionPlanModel.getSubscriptionPlanById(subscriptionPlanId);

      if (!subscriptionPlan) {
        return res.status(404).json({
          success: false,
          message: 'Subscription Plan not found or is deleted',
          data: null,
          subscriptionPlanId
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Subscription Plan retrieved successfully',
        data: subscriptionPlan,
        subscriptionPlanId
      });
    } catch (err) {
      console.error('getSubscriptionPlanById error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        subscriptionPlanId: null
      });
    }
  }

  // Update a Subscription Plan
  static async updateSubscriptionPlan(req, res) {
    try {
      const { id } = req.params;
      const {
        SubscriptionPlanName,
        Description,
        Fees,
        BillingFrequencyID,
        CreatedByID
      } = req.body;

      const subscriptionPlanId = parseInt(id);
      if (!id || isNaN(subscriptionPlanId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanID is required',
          data: null,
          subscriptionPlanId: null
        });
      }

      // Basic validation
      if (!SubscriptionPlanName || Fees == null || !BillingFrequencyID || !CreatedByID) {
        return res.status(400).json({
          success: false,
          message: 'SubscriptionPlanName, Fees, BillingFrequencyID, and CreatedByID are required',
          data: null,
          subscriptionPlanId
        });
      }

      // Sanitize inputs
      const sanitizedData = {
        subscriptionPlanName: String(SubscriptionPlanName).trim(),
        description: Description ? String(Description).trim() : null,
        fees: parseFloat(Fees),
        billingFrequencyId: parseInt(BillingFrequencyID),
        createdById: parseInt(CreatedByID)
      };

      if (isNaN(sanitizedData.fees) || isNaN(sanitizedData.billingFrequencyId) || isNaN(sanitizedData.createdById)) {
        return res.status(400).json({
          success: false,
          message: 'Fees, BillingFrequencyID, and CreatedByID must be valid numbers',
          data: null,
          subscriptionPlanId
        });
      }

      const result = await SubscriptionPlanModel.updateSubscriptionPlan(subscriptionPlanId, sanitizedData);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        subscriptionPlanId
      });
    } catch (err) {
      console.error('updateSubscriptionPlan error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        subscriptionPlanId: null
      });
    }
  }

  // Delete a Subscription Plan
  static async deleteSubscriptionPlan(req, res) {
    try {
      const { id } = req.params;
      const { DeletedByID } = req.body;

      const subscriptionPlanId = parseInt(id);
      if (!id || isNaN(subscriptionPlanId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid SubscriptionPlanID is required',
          data: null,
          subscriptionPlanId: null
        });
      }

      if (!DeletedByID || isNaN(parseInt(DeletedByID))) {
        return res.status(400).json({
          success: false,
          message: 'Valid DeletedByID is required',
          data: null,
          subscriptionPlanId
        });
      }

      const result = await SubscriptionPlanModel.deleteSubscriptionPlan(subscriptionPlanId, parseInt(DeletedByID));

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        subscriptionPlanId
      });
    } catch (err) {
      console.error('deleteSubscriptionPlan error:', err.stack);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        subscriptionPlanId: null
      });
    }
  }
}

module.exports = SubscriptionPlanController;