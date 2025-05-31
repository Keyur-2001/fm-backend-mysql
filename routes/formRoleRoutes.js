const express = require('express');
const router = express.Router();
const FormRoleController = require('../controllers/formRoleController');

<<<<<<< HEAD
// Assuming you have authentication middleware
// const authMiddleware = require('../middleware/auth'); // Adjust path as needed

router.post('/',  FormRoleController.createFormRole);
router.put('/:id', FormRoleController.updateFormRole);
router.delete('/:id', FormRoleController.deleteFormRole);
router.get('/:id', FormRoleController.getFormRole);
router.get('/',  FormRoleController.getAllFormRoles);
=======
// Routes for FormRole management
router.get('/', FormRoleController.getAllFormRoles); // GET /api/form-roles
router.post('/', FormRoleController.createFormRole); // POST /api/form-roles
router.get('/:id', FormRoleController.getFormRoleById); // GET /api/form-roles/:id
router.put('/:id', FormRoleController.updateFormRole); // PUT /api/form-roles/:id
router.delete('/:id', FormRoleController.deleteFormRole); // DELETE /api/form-roles/:id
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7

module.exports = router;