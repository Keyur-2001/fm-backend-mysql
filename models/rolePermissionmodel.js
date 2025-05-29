const poolPromise = require('../config/db.config');
const sql = require('mssql');

const getRolePermissionsByNames = async (roleName, permissionName) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        let query = `
            SELECT 
                rp.*,
                r.RoleName,
                p.PermissionName,
                per.FirstName AS PersonName,
                per.IsDeleted AS PersonIsDeleted
            FROM tblROLEPERMISSION rp
            INNER JOIN tblROLES r ON rp.RoleID = r.RoleID
            INNER JOIN tblPERMISSION p ON rp.PermissionID = p.PermissionID
            LEFT JOIN tblPERSON per ON rp.PersonID = per.PersonID
          
        `;

        if (roleName && permissionName) {
            query += ` AND r.RoleName = @roleName AND p.PermissionName = @permissionName`;
            request.input('roleName', sql.NVarChar, roleName);
            request.input('permissionName', sql.NVarChar, permissionName);
        }

        console.log('Executing query:', query);
        console.log('Parameters:', { roleName, permissionName });
        const result = await request.query(query);
        console.log('Query result:', result.recordset);
        return result.recordset;
    } catch (error) {
        console.error('Database error:', error.message);
        throw new Error(`Database error: ${error.message}`);
    }
};

module.exports = { getRolePermissionsByNames };