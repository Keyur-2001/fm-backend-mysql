const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/rolesController');

// Get all Roles
router.get('/', RoleController.getAllRoles);

// Create a new Role
router.post('/', RoleController.createRole);

// Get a single Role by ID
router.get('/:id', RoleController.getRoleById);

// Update a Role
router.put('/:id', RoleController.updateRole);

// Delete a Role
router.delete('/:id', RoleController.deleteRole);

module.exports = router;