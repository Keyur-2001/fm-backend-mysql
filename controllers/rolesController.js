const RoleModel = require('../models/rolesModel');

class RoleController {
  // Get all Roles
  static async getAllRoles(req, res) {
    try {
      const { pageNumber, pageSize, fromDate, toDate, roleName, createdBy } = req.query;
      const result = await RoleModel.getAllRoles({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 10,
        fromDate: fromDate || null,
        toDate: toDate || null,
        roleName: roleName || null,
        createdBy: createdBy || null
      });
      res.status(200).json({
        success: true,
        message: 'Role records retrieved successfully.',
        data: result.data,
        totalRecords: result.totalRecords,
        roleId: null,
        newRoleId: null
      });
    } catch (err) {
      console.error('Error in getAllRoles:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        roleId: null,
        newRoleId: null
      });
    }
  }

  // Create a new Role
  static async createRole(req, res) {
    try {
      const data = req.body;
      // Validate required fields
      if (!data.roleName || !data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'RoleName and CreatedById are required.',
          data: null,
          roleId: null,
          newRoleId: null
        });
      }

      const result = await RoleModel.createRole(data);
      res.status(201).json({
        success: true,
        message: result.message,
        data: null,
        roleId: null,
        newRoleId: result.newRoleId
      });
    } catch (err) {
      console.error('Error in createRole:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        roleId: null,
        newRoleId: null
      });
    }
  }

  // Get a single Role by ID
  static async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleModel.getRoleById(parseInt(id));
      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found.',
          data: null,
          roleId: null,
          newRoleId: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Role retrieved successfully.',
        data: role,
        roleId: id,
        newRoleId: null
      });
    } catch (err) {
      console.error('Error in getRoleById:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        roleId: null,
        newRoleId: null
      });
    }
  }

  // Update a Role
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate required fields
      if (!data.createdById) {
        return res.status(400).json({
          success: false,
          message: 'CreatedById is required.',
          data: null,
          roleId: null,
          newRoleId: null
        });
      }

      const result = await RoleModel.updateRole(parseInt(id), data);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        roleId: id,
        newRoleId: null
      });
    } catch (err) {
      console.error('Error in updateRole:', err);
      res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
        data: null,
        roleId: null,
        newRoleId: null
      });
    }
  }

  // Delete a Role
 static async deleteRole(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body; // No validation, pass as-is
    const result = await RoleModel.deleteRole(parseInt(id), userId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: null,
      roleId: id,
      newRoleId: null
    });
  } catch (err) {
    console.error('Error in deleteRole:', err);
    res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
      data: null,
      roleId: null,
      newRoleId: null
    });
  }
}
}

module.exports = RoleController;