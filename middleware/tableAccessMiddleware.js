const poolPromise = require('../config/db.config');

const tableAccessMiddleware = async (req, res, next) => {
  try {
    // Ensure user is authenticated and roleId/role are available
    if (!req.user || !req.user.roleId || !req.user.personId || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required or user data missing',
        data: null,
        salesRFQId: null,
        newSalesRFQId: null
      });
    }

    const roleId = parseInt(req.user.roleId);
    const personId = parseInt(req.user.personId);
    const pool = await poolPromise;

    // Fetch permissions based on RoleID and PersonID (user-specific permissions only)
    const [rolePermissions] = await pool.query(
      `SELECT p.TablePermission, rp.AllowRead, rp.AllowWrite, rp.AllowUpdate, rp.AllowDelete, rp.IsMaster
       FROM dbo_tblrolepermission rp
       JOIN dbo_tblpermission p ON rp.PermissionID = p.PermissionID
       WHERE rp.RoleID = ?
       AND rp.PersonID = ?
       AND p.IsDeleted = 0`,
      [roleId, personId]
    );

    // Map the permissions to a list of accessible tables with allowed actions
    // Only include tables where at least one permission is true
    const accessibleTables = rolePermissions
      .map(permission => ({
        tableName: permission.TablePermission,
        permissions: {
          read: permission.AllowRead === 1,
          write: permission.AllowWrite === 1,
          update: permission.AllowUpdate === 1,
          delete: permission.AllowDelete === 1
        },
        isMaster: permission.IsMaster === 1
      }))
      .filter(table => 
        table.permissions.read || 
        table.permissions.write || 
        table.permissions.update || 
        table.permissions.delete
      );

    // Separate master tables (IsMaster = 1) and non-master tables (IsMaster = 0)
    const masterTables = accessibleTables
      .filter(table => table.isMaster)
      .map(({ tableName, permissions }) => ({
        tableName,
        permissions
      }));

    const nonMasterTables = accessibleTables
      .filter(table => !table.isMaster)
      .map(({ tableName, permissions }) => ({
        tableName,
        permissions
      }));

    // Structure the response data
    req.user.accessibleTables = {
      tables: nonMasterTables,
      masterTables
    };

    // If no tables are accessible (neither master nor non-master), return a 403 response
    if (!req.user.accessibleTables.tables || req.user.accessibleTables.tables.length === 0 && req.user.accessibleTables.masterTables.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No tables accessible for this user',
        data: null,
        salesRFQId: null,
        newSalesRFQId: null
      });
    }

    next();
  } catch (error) {
    console.error('Table access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
      data: null,
      salesRFQId: null,
      newSalesRFQId: null
    });
  }
};

module.exports = tableAccessMiddleware;