<<<<<<< HEAD
// models/itemModel.js
const sql = require('mssql');
const poolPromise = require('../config/db.config'); // Import the poolPromise from db.js

const itemFields = `
    ItemID,
    ItemCode,
    ItemName,
    ItemGroupID,
    DefaultUOMID,
    CreatedByID,
    CreatedDateTime,
    IsDeleted,
    DeletedDateTime,
    DeletedByID,
    RowVersionColumn
`;

class ItemModel {
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

  // Get all Items
  static async getAllItems() {
    try {
      const pool = await this.#getPool();
      const result = await pool.request()
        .query(`SELECT ${itemFields} 
                FROM dbo.tblItem 
                WHERE IsDeleted = 0 
                ORDER BY ItemName`);
      return result.recordset ?? [];
    } catch (err) {
      console.error('Error fetching all items:', err);
      throw new Error(`Failed to fetch items: ${err.message}`);
    }
  }

  // Get Item by ID
  static async getItemById(id) {
    try {
      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        throw new Error('ItemID must be a valid number');
      }

      const pool = await this.#getPool();
      const result = await pool.request()
        .input('ItemID', sql.Int, itemId)
        .query(`SELECT ${itemFields} 
                FROM dbo.tblItem 
                WHERE ItemID = @ItemID AND IsDeleted = 0`);
      
      return result.recordset[0] ?? null;
    } catch (err) {
      console.error(`Error fetching item with ID ${id}:`, err);
      throw new Error(`Failed to fetch item ${id}: ${err.message}`);
    }
  }

  // Create new Item
  static async createItem(data) {
    try {
      if (!data || !data.ItemName) {
        throw new Error('ItemName is required');
      }

      const pool = await this.#getPool();
      const request = pool.request()
        .input('ItemCode', sql.NVarChar(50), data.ItemCode || null)
        .input('ItemName', sql.NVarChar(100), data.ItemName)
        .input('ItemGroupID', sql.Int, data.ItemGroupID ? parseInt(data.ItemGroupID) : null)
        .input('DefaultUOMID', sql.Int, data.DefaultUOMID ? parseInt(data.DefaultUOMID) : null)
        .input('CreatedByID', sql.Int, data.CreatedByID ? parseInt(data.CreatedByID) : null)
        .input('IsDeleted', sql.Bit, 0);

      const query = `
        INSERT INTO dbo.tblItem (
          ItemCode, ItemName, ItemGroupID, DefaultUOMID,
          CreatedByID, CreatedDateTime, IsDeleted
        )
        VALUES (
          @ItemCode, @ItemName, @ItemGroupID, @DefaultUOMID,
          @CreatedByID, GETDATE(), @IsDeleted
        );
        SELECT ${itemFields}
        FROM dbo.tblItem
        WHERE ItemID = SCOPE_IDENTITY();
      `;

      const result = await request.query(query);
      return result.recordset[0];
    } catch (err) {
      console.error('Error creating item:', err);
      throw new Error(`Failed to create item: ${err.message}`);
    }
  }

  // Update Item
  static async updateItem(id, data) {
    try {
      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        throw new Error('ItemID must be a valid number');
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Update data is required');
      }
      if (data.ItemName === '') {
        throw new Error('ItemName cannot be empty');
      }

      const pool = await this.#getPool();
      const request = pool.request()
        .input('ItemID', sql.Int, itemId);

      const updateFields = [];
      if (data.ItemCode !== undefined) {
        request.input('ItemCode', sql.NVarChar(50), data.ItemCode);
        updateFields.push('ItemCode = @ItemCode');
      }
      if (data.ItemName !== undefined) {
        request.input('ItemName', sql.NVarChar(100), data.ItemName);
        updateFields.push('ItemName = @ItemName');
      }
      if (data.ItemGroupID !== undefined) {
        request.input('ItemGroupID', sql.Int, data.ItemGroupID ? parseInt(data.ItemGroupID) : null);
        updateFields.push('ItemGroupID = @ItemGroupID');
      }
      if (data.DefaultUOMID !== undefined) {
        request.input('DefaultUOMID', sql.Int, data.DefaultUOMID ? parseInt(data.DefaultUOMID) : null);
        updateFields.push('DefaultUOMID = @DefaultUOMID');
      }
      if (data.IsDeleted !== undefined) {
        request.input('IsDeleted', sql.Bit, data.IsDeleted ? 1 : 0);
        updateFields.push('IsDeleted = @IsDeleted');
      }
      if (data.DeletedByID !== undefined) {
        request.input('DeletedByID', sql.Int, data.DeletedByID ? parseInt(data.DeletedByID) : null);
        updateFields.push('DeletedByID = @DeletedByID');
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields provided for update');
      }

      const query = `
        UPDATE dbo.tblItem
        SET ${updateFields.join(',\n            ')}
        WHERE ItemID = @ItemID AND IsDeleted = 0;
        SELECT ${itemFields}
        FROM dbo.tblItem
        WHERE ItemID = @ItemID AND IsDeleted = 0;
      `;

      const result = await request.query(query);
      return result.recordset[0] ?? null;
    } catch (err) {
      console.error(`Error updating item with ID ${id}:`, err);
      throw new Error(`Failed to update item ${id}: ${err.message}`);
    }
  }

  // Delete Item (Soft Delete)
  static async deleteItem(id, deletedByID) {
    try {
      const itemId = parseInt(id);
      if (isNaN(itemId)) {
        throw new Error('ItemID must be a valid number');
      }
      const deletedBy = parseInt(deletedByID);
      if (isNaN(deletedBy)) {
        throw new Error('DeletedByID must be a valid number');
      }

      const pool = await this.#getPool();
      const request = pool.request()
        .input('ItemID', sql.Int, itemId)
        .input('DeletedByID', sql.Int, deletedBy);

      const query = `
        UPDATE dbo.tblItem
        SET IsDeleted = 1,
            DeletedByID = @DeletedByID,
            DeletedDateTime = GETDATE()
        WHERE ItemID = @ItemID AND IsDeleted = 0;
        SELECT @@ROWCOUNT AS AffectedRows;
      `;

      const result = await request.query(query);
      return result.recordset[0].AffectedRows > 0;
    } catch (err) {
      console.error(`Error deleting item with ID ${id}:`, err);
      throw new Error(`Failed to delete item ${id}: ${err.message}`);
=======
const poolPromise = require('../config/db.config');

class ItemModel {
  // Get paginated Items
  static async getAllItems({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Log query parameters
      console.log('getAllItems params:', queryParams);

      // Call SP_GetAllItems
      const [results] = await pool.query(
        'CALL SP_GetAllItems(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAllItems results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');
      
      // Log output
      console.log('getAllItems output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllItems');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve items');
      }

      return {
        data: results[0] || [],
        totalRecords: null // SP does not return total count
      };
    } catch (err) {
      console.error('getAllItems error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Item
  static async createItem(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_ItemID
        data.itemCode,
        data.itemName,
        data.certificationId,
        data.itemImage,
        data.itemImageFileName,
        data.itemGroupId,
        data.defaultUomId,
        data.createdById
      ];

      // Log query parameters
      console.log('createItem params:', queryParams);

      // Call SP_ManageItem
      const [results] = await pool.query(
        'CALL SP_ManageItem(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('createItem results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_ItemID AS p_ItemID');

      // Log output
      console.log('createItem output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageItem');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Item');
      }

      return {
        itemId: output[0].p_ItemID || null, // SP returns the new ItemID
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createItem error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Item by ID
  static async getItemById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_ItemCode
        null, // p_ItemName
        null, // p_CertificationID
        null, // p_ItemImage
        null, // p_ItemImageFileName
        null, // p_ItemGroupID
        null, // p_DefaultUOMID
        null  // p_CreatedByID
      ];

      // Log query parameters
      console.log('getItemById params:', queryParams);

      // Call SP_ManageItem
      const [results] = await pool.query(
        'CALL SP_ManageItem(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getItemById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getItemById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageItem');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Item not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getItemById error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update an Item
  static async updateItem(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.itemCode,
        data.itemName,
        data.certificationId,
        data.itemImage,
        data.itemImageFileName,
        data.itemGroupId,
        data.defaultUomId,
        data.createdById
      ];

      // Log query parameters
      console.log('updateItem params:', queryParams);

      // Call SP_ManageItem
      const [results] = await pool.query(
        'CALL SP_ManageItem(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('updateItem results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateItem output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageItem');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Item');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateItem error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete an Item
  static async deleteItem(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_ItemCode
        null, // p_ItemName
        null, // p_CertificationID
        null, // p_ItemImage
        null, // p_ItemImageFileName
        null, // p_ItemGroupID
        null, // p_DefaultUOMID
        createdById
      ];

      // Log query parameters
      console.log('deleteItem params:', queryParams);

      // Call SP_ManageItem
      const [results] = await pool.query(
        'CALL SP_ManageItem(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('deleteItem results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deleteItem output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageItem');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Item');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteItem error:', err);
      throw new Error(`Database error: ${err.message}`);
>>>>>>> 242b5598e7132a94861b3e2479750753c8c0ccd7
    }
  }
}

module.exports = ItemModel;