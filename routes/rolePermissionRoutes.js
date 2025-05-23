const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissioncontroller');

router.get('/role-permissions', rolePermissionController.getRolePermissions);

module.exports = router;