const sql = require('mssql');
const poolPromise = require('../config/db.config'); // Import the poolPromise from db.js

// Define fields to select from tblServiceType
const serviceTypeFields = `
    ServiceTypeID,
    ServiceGroup,
    ServiceType,
    CreatedByID,
    CreatedDateTime,
    IsDeleted,
    DeletedDateTime,
    DeletedByID,
    RowVersionColumn
`;

class ServiceTypeModel {
  // Private helper to get connected pool
  static async #getPool() {
    try {
      const pool = await poolPromise;
      if (!pool.connected) {
        throw new Error('Database pool is not connected');
      }
      return pool;
    } catch (err) {
      console.error('Failed to get database pool:', err);
      throw new Error('Database connection unavailable');
    }
  }

  // Get all non-deleted service types
  static async getAllServiceTypes() {
    try {
      const pool = await this.#getPool();
      const result = await pool.request()
        .query(`SELECT ${serviceTypeFields} 
                FROM dbo.tblServiceType 
                WHERE IsDeleted = 0 
                ORDER BY ServiceType`); // Added ORDER BY for consistency
      return result.recordset ?? []; // Return empty array if no results
    } catch (err) {
      console.error('SQL error in getAllServiceTypes:', err);
      throw new Error(`Failed to retrieve service types: ${err.message}`);
    }
  }

  // Get a single service type by ID
  static async getServiceTypeById(id) {
    try {
      // Input validation
      const serviceTypeId = parseInt(id);
      if (isNaN(serviceTypeId)) {
        throw new Error('ServiceType ID must be a valid number');
      }

      const pool = await this.#getPool();
      const result = await pool.request()
        .input('ServiceTypeID', sql.Int, serviceTypeId)
        .query(`SELECT ${serviceTypeFields} 
                FROM dbo.tblServiceType 
                WHERE ServiceTypeID = @ServiceTypeID 
                AND IsDeleted = 0`);
      return result.recordset[0] ?? null; // Return null if not found
    } catch (err) {
      console.error(`SQL error in getServiceTypeById for ID ${id}:`, err);
      throw new Error(`Failed to retrieve service type ${id}: ${err.message}`);
    }
  }
}

module.exports = ServiceTypeModel;