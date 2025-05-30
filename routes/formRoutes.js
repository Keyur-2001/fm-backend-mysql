const express = require('express');
const router = express.Router();
const FormController = require('../controllers/formController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
// router.use(authMiddleware);

// Create a new form
router.post('/', FormController.createForm);

// Update an existing form
router.put('/:id', FormController.updateForm);

// Delete a form (soft delete)
router.delete('/:id', FormController.deleteForm);

// Get a specific form by ID
router.get('/:id', FormController.getForm);

// Get all forms with pagination
router.get('/', FormController.getAllForms);

module.exports = router;