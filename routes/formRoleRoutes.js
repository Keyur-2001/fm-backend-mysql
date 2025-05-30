const express = require('express');
const router = express.Router();
const FormRoleController = require('../controllers/formRoleController');

// Assuming you have authentication middleware
// const authMiddleware = require('../middleware/auth'); // Adjust path as needed

router.post('/',  FormRoleController.createFormRole);
router.put('/:id', FormRoleController.updateFormRole);
router.delete('/:id', FormRoleController.deleteFormRole);
router.get('/:id', FormRoleController.getFormRole);
router.get('/',  FormRoleController.getAllFormRoles);

module.exports = router;