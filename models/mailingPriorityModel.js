const sql = require('mssql');
const poolPromise = require('../config/db.config'); // Import the poolPromise from db.js

class MailingPriorityModel {
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

  // Define fields for consistency
  static #mailingPriorityFields = `
    MailingPriorityID,
    PriorityName,
    PriorityDescription,
    CreatedByID,
    CreatedDateTime,
    IsDeleted,
    DeletedDateTime,
    DeletedByID
  `;

  // Get all mailing priorities where IsDeleted = 0
  static async getAllMailingPriorities() {
    try {
      const pool = await this.#getPool();
      const result = await pool.request()
        .query(`
          SELECT ${this.#mailingPriorityFields}
          FROM dbo.tblMailingPriority 
          WHERE IsDeleted = 0
          ORDER BY PriorityName
        `);
      return result.recordset ?? [];
    } catch (err) {
      console.error('Error fetching all mailing priorities:', err);
      throw new Error(`Failed to fetch mailing priorities: ${err.message}`);
    }
  }

  // Update a mailing priority by MailingPriorityID where IsDeleted = 0
  static async updateMailingPriority(id, data) {
    try {
      // Input validation
      const mailingPriorityId = parseInt(id);
      if (isNaN(mailingPriorityId)) {
        throw new Error('MailingPriorityID must be a valid number');
      }
      if (!data || !data.PriorityName) {
        throw new Error('PriorityName is required for update');
      }

      const pool = await this.#getPool();
      const request = pool.request()
        .input('MailingPriorityID', sql.Int, mailingPriorityId)
        .input('PriorityName', sql.NVarChar(100), data.PriorityName)
        .input('PriorityDescription', sql.NVarChar(255), data.PriorityDescription || null)
        .input('CreatedByID', sql.Int, data.CreatedByID ? parseInt(data.CreatedByID) : null)
        .input('CreatedDateTime', sql.DateTime, data.CreatedDateTime || null)
        .input('IsDeleted', sql.Bit, data.IsDeleted !== undefined ? (data.IsDeleted ? 1 : 0) : null)
        .input('DeletedDateTime', sql.DateTime, data.DeletedDateTime || null)
        .input('DeletedByID', sql.Int, data.DeletedByID ? parseInt(data.DeletedByID) : null);

      const result = await request.query(`
        UPDATE dbo.tblMailingPriority
        SET PriorityName = @PriorityName,
            PriorityDescription = COALESCE(@PriorityDescription, PriorityDescription),
            CreatedByID = COALESCE(@CreatedByID, CreatedByID),
            CreatedDateTime = COALESCE(@CreatedDateTime, CreatedDateTime),
            IsDeleted = COALESCE(@IsDeleted, IsDeleted),
            DeletedDateTime = COALESCE(@DeletedDateTime, DeletedDateTime),
            DeletedByID = COALESCE(@DeletedByID, DeletedByID)
        WHERE MailingPriorityID = @MailingPriorityID AND IsDeleted = 0
      `);

      if (result.rowsAffected[0] === 0) {
        return null; // Indicate no record was updated (not found or already deleted)
      }

      // Fetch and return the updated record
      const updatedResult = await pool.request()
        .input('MailingPriorityID', sql.Int, mailingPriorityId)
        .query(`
          SELECT ${this.#mailingPriorityFields}
          FROM dbo.tblMailingPriority 
          WHERE MailingPriorityID = @MailingPriorityID AND IsDeleted = 0
        `);
      return updatedResult.recordset[0] ?? null;
    } catch (err) {
      console.error(`Error updating mailing priority with ID ${id}:`, err);
      throw new Error(`Failed to update mailing priority ${id}: ${err.message}`);
    }
  }
}

module.exports = MailingPriorityModel;