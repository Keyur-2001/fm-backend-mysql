const express = require('express');
const router = express.Router();
const FormRoleController = require('../controllers/formRoleController');

// Get all FormRoles with pagination and filters
router.get('/', FormRoleController.getAllFormRoles);

// Create a new FormRole
router.post('/', FormRoleController.createFormRole);

// Get a single FormRole by ID
router.get('/:id', FormRoleController.getFormRoleById);

// Update a FormRole
router.put('/:id', FormRoleController.updateFormRole);

// Delete a FormRole
router.delete('/:id', FormRoleController.deleteFormRole);

module.exports = router;