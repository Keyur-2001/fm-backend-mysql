const poolPromise = require('../config/db.config');

class SalesOrderParcelModel {
  static async #executeManageStoredProcedure(action, salesOrderParcelData) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        action,
        salesOrderParcelData.SalesOrderParcelID ? parseInt(salesOrderParcelData.SalesOrderParcelID) : null,
        salesOrderParcelData.SalesOrderID ? parseInt(salesOrderParcelData.SalesOrderID) : null,
        salesOrderParcelData.SalesQuotationParcelID ? parseInt(salesOrderParcelData.SalesQuotationParcelID) : null,
        salesOrderParcelData.SupplierQuotationParcelID ? parseInt(salesOrderParcelData.SupplierQuotationParcelID) : null,
        salesOrderParcelData.ParcelID ? parseInt(salesOrderParcelData.ParcelID) : null,
        salesOrderParcelData.ItemID ? parseInt(salesOrderParcelData.ItemID) : null,
        salesOrderParcelData.CertificationID ? parseInt(salesOrderParcelData.CertificationID) : null,
        salesOrderParcelData.LineItemNumber ? parseInt(salesOrderParcelData.LineItemNumber) : null,
        salesOrderParcelData.RequiredByDate || null,
        salesOrderParcelData.ItemQuantity ? parseFloat(salesOrderParcelData.ItemQuantity) : null,
        salesOrderParcelData.UOMID ? parseInt(salesOrderParcelData.UOMID) : null,
        salesOrderParcelData.SalesRate ? parseFloat(salesOrderParcelData.SalesRate) : null,
        salesOrderParcelData.SalesAmount ? parseFloat(salesOrderParcelData.SalesAmount) : null,
        salesOrderParcelData.CountryOfOriginID ? parseInt(salesOrderParcelData.CountryOfOriginID) : null,
        salesOrderParcelData.ChangedByID ? parseInt(salesOrderParcelData.ChangedByID) : null
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesOrderParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? `${action} operation successful` : 'Operation failed'),
        data: action === 'SELECT' ? result[0] || [] : null,
        salesOrderParcelId: salesOrderParcelData.SalesOrderParcelID,
        salesOrderId: salesOrderParcelData.SalesOrderID
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(salesOrderParcelData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'UPDATE') {
      if (salesOrderParcelData.SalesOrderID) {
        const [salesOrderCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsalesorder WHERE SalesOrderID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.SalesOrderID)]
        );
        if (salesOrderCheck.length === 0) errors.push(`SalesOrderID ${salesOrderParcelData.SalesOrderID} does not exist`);
      }
      if (salesOrderParcelData.SalesQuotationParcelID) {
        const [salesQuotationParcelCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsalesquotationparcel WHERE SalesQuotationParcelID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.SalesQuotationParcelID)]
        );
        if (salesQuotationParcelCheck.length === 0) errors.push(`SalesQuotationParcelID ${salesOrderParcelData.SalesQuotationParcelID} does not exist`);
      }
      if (salesOrderParcelData.SupplierQuotationParcelID) {
        const [supplierQuotationParcelCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsupplierquotationparcel WHERE SupplierQuotationParcelID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.SupplierQuotationParcelID)]
        );
        if (supplierQuotationParcelCheck.length === 0) errors.push(`SupplierQuotationParcelID ${salesOrderParcelData.SupplierQuotationParcelID} does not exist`);
      }
      if (salesOrderParcelData.ParcelID) {
        const [parcelCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblparcel WHERE ParcelID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.ParcelID)]
        );
        if (parcelCheck.length === 0) errors.push(`ParcelID ${salesOrderParcelData.ParcelID} does not exist`);
      }
      if (salesOrderParcelData.ItemID) {
        const [itemCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblitem WHERE ItemID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.ItemID)]
        );
        if (itemCheck.length === 0) errors.push(`ItemID ${salesOrderParcelData.ItemID} does not exist`);
      }
      if (salesOrderParcelData.CertificationID) {
        const [certificationCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblcertification WHERE CertificationID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.CertificationID)]
        );
        if (certificationCheck.length === 0) errors.push(`CertificationID ${salesOrderParcelData.CertificationID} does not exist`);
      }
      if (salesOrderParcelData.UOMID) {
        const [uomCheck] = await pool.query(
          'SELECT 1 FROM dbo_tbluom WHERE UOMID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.UOMID)]
        );
        if (uomCheck.length === 0) errors.push(`UOMID ${salesOrderParcelData.UOMID} does not exist`);
      }
      if (salesOrderParcelData.CountryOfOriginID) {
        const [countryCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblcountry WHERE CountryID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderParcelData.CountryOfOriginID)]
        );
        if (countryCheck.length === 0) errors.push(`CountryOfOriginID ${salesOrderParcelData.CountryOfOriginID} does not exist`);
      }
      if (salesOrderParcelData.ChangedByID) {
        const [changedByCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblperson WHERE PersonID = ?',
          [parseInt(salesOrderParcelData.ChangedByID)]
        );
        if (changedByCheck.length === 0) errors.push(`ChangedByID ${salesOrderParcelData.ChangedByID} does not exist`);
      }
    }

    if (action === 'DELETE' && salesOrderParcelData.ChangedByID) {
      const [changedByCheck] = await pool.query(
        'SELECT 1 FROM dbo_tblperson WHERE PersonID = ?',
        [parseInt(salesOrderParcelData.ChangedByID)]
      );
      if (changedByCheck.length === 0) errors.push(`ChangedByID ${salesOrderParcelData.ChangedByID} does not exist`);
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async getSalesOrderParcels({ salesOrderParcelID = null, salesOrderID = null, pageNumber = 1, pageSize = 10 }) {
    try {
      const salesOrderParcelData = {
        SalesOrderParcelID: salesOrderParcelID,
        SalesOrderID: salesOrderID
      };

      const result = await this.#executeManageStoredProcedure('SELECT', salesOrderParcelData);

      if (!result.success) {
        return {
          success: false,
          message: result.message,
          data: null,
          salesOrderParcelId: salesOrderParcelID,
          salesOrderId: salesOrderID,
          totalRecords: 0
        };
      }

      let parcels = result.data || [];

      if (!salesOrderParcelID && !salesOrderID) {
        const start = (pageNumber - 1) * pageSize;
        const end = start + pageSize;
        parcels = parcels.slice(start, end);
      }

      return {
        success: true,
        message: result.message,
        data: parcels,
        salesOrderParcelId: salesOrderParcelID,
        salesOrderId: salesOrderID,
        totalRecords: salesOrderParcelID || salesOrderID ? parcels.length : (result.data ? result.data.length : 0)
      };
    } catch (error) {
      console.error('Error in getSalesOrderParcels:', error);
      return {
        success: false,
        message: `Server error: ${error.message}`,
        data: null,
        salesOrderParcelId: salesOrderParcelID,
        salesOrderId: salesOrderID,
        totalRecords: 0
      };
    }
  }

  static async updateSalesOrderParcel(salesOrderParcelData) {
    if (!salesOrderParcelData.SalesOrderParcelID) {
      return {
        success: false,
        message: 'SalesOrderParcelID is required for UPDATE',
        data: null,
        salesOrderParcelId: null,
        salesOrderId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(salesOrderParcelData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesOrderParcelId: salesOrderParcelData.SalesOrderParcelID,
        salesOrderId: salesOrderParcelData.SalesOrderID
      };
    }

    return await this.#executeManageStoredProcedure('UPDATE', salesOrderParcelData);
  }

  static async deleteSalesOrderParcel(salesOrderParcelData) {
    if (!salesOrderParcelData.SalesOrderParcelID) {
      return {
        success: false,
        message: 'SalesOrderParcelID is required for DELETE',
        data: null,
        salesOrderParcelId: null,
        salesOrderId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(salesOrderParcelData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesOrderParcelId: salesOrderParcelData.SalesOrderParcelID,
        salesOrderId: salesOrderParcelData.SalesOrderID
      };
    }

    return await this.#executeManageStoredProcedure('DELETE', salesOrderParcelData);
  }
}

module.exports = SalesOrderParcelModel;