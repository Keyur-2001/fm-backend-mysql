const poolPromise = require("../config/db.config");

class SalesInvoiceParcelModel {
  static async getAllSalesInvoiceParcels({
    pageNumber = 1,
    pageSize = 10,
    fromDate = null,
    toDate = null,
    SalesInvoiceID = null,
  }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
        throw new Error("Invalid pageNumber: must be a positive integer");
      }
      if (!Number.isInteger(pageSize) || pageSize <= 0) {
        throw new Error("Invalid pageSize: must be a positive integer");
      }
      if (SalesInvoiceID && !Number.isInteger(SalesInvoiceID)) {
        throw new Error("Invalid SalesInvoiceID: must be an integer");
      }

      const queryParams = [
        "SELECT",
        null, // p_SalesInvoiceParcelID
        SalesInvoiceID || null, // p_SalesInvoiceID
        null, // p_ItemID
        null, // p_ItemQuantity
        null, // p_UOMID
        null, // p_Rate
        null, // p_Amount
        null, // p_CertificationID
        null, // p_CountryOfOriginID
        null, // p_FileName
        null, // p_FileContent
        null, // p_UserID
      ];

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceParcelDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        queryParams
      );

      // Check if the result set contains data
      if (!result || !result[0]) {
        return {
          data: [],
          totalRecords: 0,
        };
      }

      // Apply pagination
      const parcels = result[0];
      const startIndex = (pageNumber - 1) * pageSize;
      const paginatedParcels = parcels.slice(startIndex, startIndex + pageSize);

      return {
        data: paginatedParcels,
        totalRecords: parcels.length,
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async createSalesInvoiceParcel(data) {
    try {
      const pool = await poolPromise;

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceParcelDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "INSERT",
          null,
          data.SalesInvoiceID,
          data.ItemID,
          data.ItemQuantity,
          data.UOMID || null,
          data.Rate,
          data.Amount,
          data.CertificationID || null,
          data.CountryOfOriginID || null,
          data.FileName || null,
          data.FileContent || null,
          data.UserID,
        ]
      );

      const response = result[0][0];
      if (response.Status !== "SUCCESS") {
        throw new Error(
          response.Message || "Failed to create Sales Invoice Parcel"
        );
      }

      return {
        salesInvoiceParcelId: response.SalesInvoiceParcelID,
        message: response.Message,
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async updateSalesInvoiceParcel(id, data) {
    try {
      const pool = await poolPromise;

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceParcelDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "UPDATE",
          id,
          data.SalesInvoiceID || null,
          data.ItemID || null,
          data.ItemQuantity || null,
          data.UOMID || null,
          data.Rate || null,
          data.Amount || null,
          data.CertificationID || null,
          data.CountryOfOriginID || null,
          data.FileName || null,
          data.FileContent || null,
          data.UserID,
        ]
      );

      const response = result[0][0];
      if (response.Status !== "SUCCESS") {
        throw new Error(
          response.Message || "Failed to update Sales Invoice Parcel"
        );
      }

      return { message: response.Message };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  static async deleteSalesInvoiceParcel(id, deletedById) {
    try {
      const pool = await poolPromise;

      const [result] = await pool.query(
        "CALL SP_ManageSalesInvoiceParcelDEV(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "DELETE",
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
          null,
          deletedById,
        ]
      );

      const response = result[0][0];
      if (response.Status !== "SUCCESS") {
        throw new Error(
          response.Message || "Failed to delete Sales Invoice Parcel"
        );
      }

      return { message: response.Message };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SalesInvoiceParcelModel;
