const poolPromise = require('../config/db.config');

class SupplierModel {
  // Get paginated Suppliers
  static async getAllSuppliers({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Call SP_GetAllSuppliers
      const [result] = await pool.query(
        'CALL SP_GetAllSuppliers(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query('SELECT @p_Result AS result, @p_Message AS message');

      if (outParams.result !== 0) {
        throw new Error(outParams.message || 'Failed to retrieve Suppliers');
      }

      // Total count fallback (since SP_GetAllSuppliers doesn't return a separate count)
      const totalRecords = result[0].length;

      return {
        data: result[0],
        totalRecords
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Supplier
  static async createSupplier(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_SupplierID
        data.supplierName,
        data.supplierGroupId || null,
        data.supplierTypeId || null,
        data.supplierAddressId || null,
        data.supplierExportCode || null,
        data.saPartner || null,
        data.saPartnerExportCode || null,
        data.supplierEmail || null,
        data.billingCurrencyId || null,
        data.companyId || null,
        data.externalSupplierYN || 0
        // data.userId
      ];

      // Call SP_ManageSupplier
      await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_NewSupplierID, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_NewSupplierID AS newSupplierId, @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Supplier');
      }

      return {
        newSupplierId: outParams.newSupplierId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Supplier by ID
  static async getSupplierById(id) {
    try {
      const pool = await poolPromise;

      // Call SP_ManageSupplier
      const [result] = await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_NewSupplierID, @p_Result, @p_Message)',
        ['SELECT', id, null, null, null, null, null, null, null, null, null, null, null, null]
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Supplier not found');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Supplier
  static async updateSupplier(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.supplierName || null,
        data.supplierGroupId || null,
        data.supplierTypeId || null,
        data.supplierAddressId || null,
        data.supplierExportCode || null,
        data.saPartner || null,
        data.saPartnerExportCode || null,
        data.supplierEmail || null,
        data.billingCurrencyId || null,
        data.companyId || null,
        data.externalSupplierYN || null
        // data.userId
      ];

      // Call SP_ManageSupplier
      await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_NewSupplierID, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Supplier');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Supplier
  static async deleteSupplier(id, userId) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, null, null, null, null, null, null, null, null, null, null,
        userId
      ];

      // Call SP_ManageSupplier
      await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_NewSupplierID, @p_Result, @p_Message)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Supplier');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SupplierModel;