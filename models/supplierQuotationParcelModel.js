const poolPromise = require('../config/db.config');

class SupplierQuotationParcelModel {
  // Get a Supplier Quotation Parcel by ID
  static async getSupplierQuotationParcelById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotationParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Supplier Quotation Parcel not found or deleted');
      }

      return {
        parcel: result[0][0] || null
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Supplier Quotation Parcel
  static async updateSupplierQuotationParcel(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.supplierQuotationId,
        data.itemId,
        data.certificationId,
        data.lineItemNumber,
        data.itemQuantity,
        data.uomId,
        data.rate,
        data.amount,
        data.countryOfOriginId,
        data.createdById
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotationParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Supplier Quotation Parcel');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Supplier Quotation Parcel
  static async deleteSupplierQuotationParcel(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        deletedById
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSupplierQuotationParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Supplier Quotation Parcel');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SupplierQuotationParcelModel;