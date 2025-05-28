const express = require('express');
const router = express.Router();
const FormRoleApproverController = require('../controllers/formRoleApproverController');

// Get all FormRoleApprovers
router.get('/', FormRoleApproverController.getAllFormRoleApprovers);

// Create a new FormRoleApprover
router.post('/', FormRoleApproverController.createFormRoleApprover);

// Get a single FormRoleApprover by ID
router.get('/:id', FormRoleApproverController.getFormRoleApproverById);

// Update a FormRoleApprover
router.put('/:id', FormRoleApproverController.updateFormRoleApprover);

// Delete a FormRoleApprover
router.delete('/:id', FormRoleApproverController.deleteFormRoleApprover);

module.exports = router;