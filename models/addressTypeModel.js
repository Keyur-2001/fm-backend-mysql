const poolPromise = require('../config/db.config');

class AddressTypeModel {
  // Get paginated AddressTypes
  static async getAllAddressTypes({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Call SP_GetAllAddressTypes
      const [result] = await pool.query(
        'CALL SP_GetAllAddressTypes(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query('SELECT @p_Result AS result, @p_Message AS message');

      if (outParams.result !== 0) {
        throw new Error(outParams.message || 'Failed to retrieve AddressTypes');
      }

      // Extract total count from the second result set
      const totalRecords = result[1][0]?.TotalCount || 0;

      return {
        data: result[0],
        totalRecords
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new AddressType
  static async createAddressType(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_AddressTypeID
        data.addressType,
        data.createdById
      ];

      // Call sp_ManageAddressType
      await pool.query(
        'CALL sp_ManageAddressType(?, ?, ?, ?,  @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_NewAddressTypeID AS newAddressTypeId, @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create AddressType');
      }

      return {
        newAddressTypeId: outParams.newAddressTypeId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single AddressType by ID
  static async getAddressTypeById(id) {
    try {
      const pool = await poolPromise;

      // Call sp_ManageAddressType
      const [result] = await pool.query(
        'CALL sp_ManageAddressType(?, ?, ?, ?,  @p_Result, @p_Message)',
        ['SELECT', id, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'AddressType not found');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update an AddressType
  static async updateAddressType(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.addressType,
        data.createdById
      ];

      // Call sp_ManageAddressType
      await pool.query(
        'CALL sp_ManageAddressType(?, ?, ?, ?,  @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update AddressType');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete an AddressType
  static async deleteAddressType(id, createdById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null,
        createdById
      ];

      // Call sp_ManageAddressType
      await pool.query(
        'CALL sp_ManageAddressType(?, ?, ?, ?,  @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete AddressType');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = AddressTypeModel;