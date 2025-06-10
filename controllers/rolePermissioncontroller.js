const rolePermissionModel = require('../models/rolePermissionmodel');

const getRolePermissions = async (req, res) => {
    try {
        const { roleName, permissionName } = req.query;

        let rolePermissions;
        if (roleName && permissionName) {
            rolePermissions = await rolePermissionModel.getRolePermissionsByNames(roleName, permissionName);
        } else {
            rolePermissions = await rolePermissionModel.getRolePermissionsByNames(null, null);
        }

        res.status(200).json({
            success: true,
            data: rolePermissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getRolePermissions };