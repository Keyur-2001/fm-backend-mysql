const poolPromise = require('../config/db.config');

class PInvoiceParcelModel {
  // Get a single Purchase Invoice Parcel by ID
  static async getPInvoiceParcelById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_PInvoiceID
        null, // p_ItemID
        null, // p_ItemQuantity
        null, // p_UOMID
        null, // p_Rate
        null, // p_Amount
        null, // p_CertificationID
        null, // p_CountryOfOriginID
        null, // p_LineItemNumber
        null, // p_FileName
        null, // p_FileContent
        null  // p_UserID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoiceParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Purchase Invoice Parcel
  static async updatePInvoiceParcel(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.PInvoiceID || null,
        data.ItemID || null,
        data.ItemQuantity || null,
        data.UOMID || null,
        data.Rate || null,
        data.Amount || null,
        data.CertificationID || null,
        data.CountryOfOriginID || null,
        data.LineItemNumber || null,
        data.FileName || null,
        data.FileContent || null,
        data.UserID
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoiceParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const response = result[0][0];
      
      if (response.Status !== 'SUCCESS') {
        throw new Error(response.Message || 'Failed to update Purchase Invoice Parcel');
      }

      return {
        message: response.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Purchase Invoice Parcel
  static async deletePInvoiceParcel(id, deletedById) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_PInvoiceID
        null, // p_ItemID
        null, // p_ItemQuantity
        null, // p_UOMID
        null, // p_Rate
        null, // p_Amount
        null, // p_CertificationID
        null, // p_CountryOfOriginID
        null, // p_LineItemNumber
        null, // p_FileName
        null, // p_FileContent
        deletedById
      ];

      const [result] = await pool.query(
        'CALL SP_ManagePInvoiceParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        queryParams
      );

      const response = result[0][0];
      
      if (response.Status !== 'SUCCESS') {
        throw new Error(response.Message || 'Failed to delete Purchase Invoice Parcel');
      }

      return {
        message: response.Message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get all parcels for a specific Purchase Invoice (custom query)
  static async getParcelsByPInvoiceId(pInvoiceId) {
    try {
      const pool = await poolPromise;

      // Since your SP doesn't have a specific action for getting by PInvoiceID,
      // you might need a separate query or modify the SP to handle this
      const [result] = await pool.query(
        'SELECT * FROM dbo_tblpinvoiceparcel WHERE PInvoiceID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
        [pInvoiceId]
      );

      return result;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update parcel item quantity and recalculate amount
  static async updateParcelQuantity(id, itemQuantity, rate, userId) {
    try {
      const amount = itemQuantity * rate;
      
      const updateData = {
        ItemQuantity: itemQuantity,
        Amount: amount,
        UserID: userId
      };

      return await this.updatePInvoiceParcel(id, updateData);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update parcel rate and recalculate amount
  static async updateParcelRate(id, rate, itemQuantity, userId) {
    try {
      const amount = itemQuantity * rate;
      
      const updateData = {
        Rate: rate,
        Amount: amount,
        UserID: userId
      };

      return await this.updatePInvoiceParcel(id, updateData);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update parcel certification
  static async updateParcelCertification(id, certificationId, userId) {
    try {
      const updateData = {
        CertificationID: certificationId,
        UserID: userId
      };

      return await this.updatePInvoiceParcel(id, updateData);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update parcel country of origin
  static async updateParcelCountryOfOrigin(id, countryOfOriginId, userId) {
    try {
      const updateData = {
        CountryOfOriginID: countryOfOriginId,
        UserID: userId
      };

      return await this.updatePInvoiceParcel(id, updateData);
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = PInvoiceParcelModel;