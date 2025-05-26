const poolPromise = require('../config/db.config');

class SupplierQuotationModel {
  // Get paginated Supplier Quotations
  static async getAllSupplierQuotations({ pageNumber = 1, pageSize = 10, fromDate = null, toDate = null }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        fromDate ? new Date(fromDate) : null,
        toDate ? new Date(toDate) : null
      ];

      // Call SP_GetAllSupplierQuotation
      const [result] = await pool.query(
        'CALL SP_GetAllSupplierQuotation(?, ?, ?, ?)',
        queryParams
      );

      return {
        data: result[0],
        totalRecords: result[0].length
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Supplier Quotation
  static async createSupplierQuotation(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_SupplierQuotationID
        data.supplierId,
        data.purchaseRFQId,
        data.certificationId,
        data.status || 'Draft',
        data.createdById,
        null, // p_DeletedByID
        data.rate || 0,
        data.countryOfOriginId,
        data.salesAmount || 0,
        data.taxesAndOtherCharges || 0,
        data.total || 0,
        data.fileContent || null,
        data.fileName || null
      ];

      // Call SP_ManageSupplierQuotation with 15 input parameters
      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSupplierQuotationID)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message, @p_NewSupplierQuotationID AS newSupplierQuotationId'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Supplier Quotation');
      }

      return {
        newSupplierQuotationId: outParams.newSupplierQuotationId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Supplier Quotation by ID
  static async getSupplierQuotationById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_SupplierID
        null, // p_PurchaseRFQID
        null, // p_CertificationID
        null, // p_Status
        null, // p_CreatedByID
        null, // p_DeletedByID
        null, // p_Rate
        null, // p_CountryOfOriginID
        null, // p_SalesAmount
        null, // p_TaxesAndOtherCharges
        null, // p_Total
        null, // p_FileContent
        null // p_FileName
      ];

      // Call SP_ManageSupplierQuotation with 15 input parameters
      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSupplierQuotationID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message, @p_NewSupplierQuotationID AS newSupplierQuotationId'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Supplier Quotation not found or deleted');
      }

      return {
        quotation: result[0][0] || null,
        parcels: result[1] || []
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Supplier Quotation
  static async updateSupplierQuotation(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.supplierId,
        data.purchaseRFQId,
        data.certificationId,
        data.status,
        data.createdById,
        null, // p_DeletedByID
        data.rate,
        data.countryOfOriginId,
        data.salesAmount,
        data.taxesAndOtherCharges,
        data.total,
        data.fileContent,
        data.fileName
      ];

      // Call SP_ManageSupplierQuotation with 15 input parameters
      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSupplierQuotationID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Supplier Quotation');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Supplier Quotation
  static async deleteSupplierQuotation(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_SupplierID
        null, // p_PurchaseRFQID
        null, // p_CertificationID
        null, // p_Status
        null, // p_CreatedByID
        deletedById,
        null, // p_Rate
        null, // p_CountryOfOriginID
        null, // p_SalesAmount
        null, // p_TaxesAndOtherCharges
        null, // p_Total
        null, // p_FileContent
        null // p_FileName
      ];

      // Call SP_ManageSupplierQuotation with 15 input parameters
      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSupplierQuotationID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Supplier Quotation');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SupplierQuotationModel;