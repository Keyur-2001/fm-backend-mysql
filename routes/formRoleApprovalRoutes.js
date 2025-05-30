const express = require('express');
const router = express.Router();
const FormRoleApproverController = require('../controllers/formRoleApprovalController');

// Assuming you have authentication middleware
// const authMiddleware = require('../middleware/auth'); // Adjust path as needed

router.get('/', FormRoleApproverController.getAllFormRoleApprovers);
router.post('/',  FormRoleApproverController.createFormRoleApprover);
router.put('/:id',  FormRoleApproverController.updateFormRoleApprover);
router.delete('/:id', FormRoleApproverController.deleteFormRoleApprover);
router.get('/:id',  FormRoleApproverController.getFormRoleApprover);

module.exports = router;