const express = require('express');
const router = express.Router();
const SubscriptionPlanController = require('../controllers/subscriptionPlanController');

// Optional: Add validation middleware (e.g., using express-validator) if needed
// const { validateCreateSubscriptionPlan, validateUpdateSubscriptionPlan } = require('../middleware/validators');

// Routes for Subscription Plan management
router.get('/', SubscriptionPlanController.getAllSubscriptionPlans); // GET /api/subscription-plans
router.post('/', /* validateCreateSubscriptionPlan, */ SubscriptionPlanController.createSubscriptionPlan); // POST /api/subscription-plans
router.get('/:id', SubscriptionPlanController.getSubscriptionPlanById); // GET /api/subscription-plans/:id
router.put('/:id', /* validateUpdateSubscriptionPlan, */ SubscriptionPlanController.updateSubscriptionPlan); // PUT /api/subscription-plans/:id
router.delete('/:id', SubscriptionPlanController.deleteSubscriptionPlan); // DELETE /api/subscription-plans/:id

module.exports = router;