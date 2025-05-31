const express = require('express');
const router = express.Router();
const FormController = require('../controllers/formController');
<<<<<<< HEAD
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
=======

// Routes for Form management
router.get('/', FormController.getAllForms); // GET /api/forms
router.post('/', FormController.createForm); // POST /api/forms
router.get('/:id', FormController.getFormById); // GET /api/forms/:id
router.put('/:id', FormController.updateForm); // PUT /api/forms/:id
router.delete('/:id', FormController.deleteForm); // DELETE /api/forms/:id
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

module.exports = router;