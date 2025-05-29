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

      // Log query parameters
      console.log('getAllSuppliers params:', queryParams);

      // Call SP_GetAllSuppliers (assumed to exist)
      const [results] = await pool.query(
        'CALL SP_GetAllSuppliers(?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getAllSuppliers results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');
      
      // Log output
      console.log('getAllSuppliers output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_GetAllSuppliers');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to retrieve suppliers');
      }

      return {
        data: results[0] || [],
        totalRecords: null // SP does not return total count
      };
    } catch (err) {
      console.error('getAllSuppliers error:', err);
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
        data.supplierGroupId,
        data.supplierTypeId,
        data.supplierAddressId,
        data.supplierExportCode,
        data.saPartner,
        data.saPartnerExportCode,
        data.supplierEmail,
        data.billingCurrencyId,
        data.companyId,
        data.externalSupplierYn ? 1 : 0,
        data.userId
      ];

      // Log query parameters
      console.log('createSupplier params:', queryParams);

      // Call SP_ManageSupplier
      const [results] = await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('createSupplier results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_SupplierID AS p_SupplierID');

      // Log output
      console.log('createSupplier output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSupplier');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to create Supplier');
      }

      return {
        supplierId: output[0].p_SupplierID || null, // SP returns the new SupplierID
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('createSupplier error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Supplier by ID
  static async getSupplierById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_SupplierName
        null, // p_SupplierGroupID
        null, // p_SupplierTypeID
        null, // p_SupplierAddressID
        null, // p_SupplierExportCode
        null, // p_SAPartner
        null, // p_SAPartnerExportCode
        null, // p_SupplierEmail
        null, // p_BillingCurrencyID
        null, // p_CompanyID
        null, // p_ExternalSupplierYN
        null  // p_UserID
      ];

      // Log query parameters
      console.log('getSupplierById params:', queryParams);

      // Call SP_ManageSupplier
      const [results] = await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('getSupplierById results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('getSupplierById output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSupplier');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Supplier not found');
      }

      return results[0][0] || null;
    } catch (err) {
      console.error('getSupplierById error:', err);
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
        data.supplierName,
        data.supplierGroupId,
        data.supplierTypeId,
        data.supplierAddressId,
        data.supplierExportCode,
        data.saPartner,
        data.saPartnerExportCode,
        data.supplierEmail,
        data.billingCurrencyId,
        data.companyId,
        data.externalSupplierYn ? 1 : 0,
        data.userId
      ];

      // Log query parameters
      console.log('updateSupplier params:', queryParams);

      // Call SP_ManageSupplier
      const [results] = await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('updateSupplier results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('updateSupplier output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSupplier');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to update Supplier');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('updateSupplier error:', err);
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
        null, // p_SupplierName
        null, // p_SupplierGroupID
        null, // p_SupplierTypeID
        null, // p_SupplierAddressID
        null, // p_SupplierExportCode
        null, // p_SAPartner
        null, // p_SAPartnerExportCode
        null, // p_SupplierEmail
        null, // p_BillingCurrencyID
        null, // p_CompanyID
        null, // p_ExternalSupplierYN
        userId
      ];

      // Log query parameters
      console.log('deleteSupplier params:', queryParams);

      // Call SP_ManageSupplier
      const [results] = await pool.query(
        'CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      // Log results
      console.log('deleteSupplier results:', JSON.stringify(results, null, 2));

      // Fetch output parameters
      const [output] = await pool.query('SELECT @p_Result AS p_Result, @p_Message AS p_Message');

      // Log output
      console.log('deleteSupplier output:', JSON.stringify(output, null, 2));

      if (!output || !output[0] || typeof output[0].p_Result === 'undefined') {
        throw new Error('Output parameters missing from SP_ManageSupplier');
      }

      if (output[0].p_Result !== 1) {
        throw new Error(output[0].p_Message || 'Failed to delete Supplier');
      }

      return {
        message: output[0].p_Message
      };
    } catch (err) {
      console.error('deleteSupplier error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SupplierModel;