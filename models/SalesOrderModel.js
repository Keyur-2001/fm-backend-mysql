const poolPromise = require('../config/db.config');

class SalesOrderModel {
  static async #executeRUDStoredProcedure(action, salesOrderData) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        action,
        salesOrderData.SalesOrderID ? parseInt(salesOrderData.SalesOrderID) : null,
        salesOrderData.SalesQuotationID ? parseInt(salesOrderData.SalesQuotationID) : null,
        salesOrderData.SalesRFQID ? parseInt(salesOrderData.SalesRFQID) : null,
        salesOrderData.CompanyID ? parseInt(salesOrderData.CompanyID) : null,
        salesOrderData.CustomerID ? parseInt(salesOrderData.CustomerID) : null,
        salesOrderData.SupplierID ? parseInt(salesOrderData.SupplierID) : null,
        salesOrderData.OriginAddressID ? parseInt(salesOrderData.OriginAddressID) : null,
        salesOrderData.DestinationAddressID ? parseInt(salesOrderData.DestinationAddressID) : null,
        salesOrderData.BillingAddressID ? parseInt(salesOrderData.BillingAddressID) : null,
        salesOrderData.CollectionAddressID ? parseInt(salesOrderData.CollectionAddressID) : null,
        salesOrderData.ShippingPriorityID ? parseInt(salesOrderData.ShippingPriorityID) : null,
        salesOrderData.PackagingRequiredYN != null ? salesOrderData.PackagingRequiredYN : null,
        salesOrderData.CollectFromSupplierYN != null ? salesOrderData.CollectFromSupplierYN : null,
        salesOrderData.Terms || null,
        salesOrderData.PostingDate ? new Date(salesOrderData.PostingDate) : null,
        salesOrderData.DeliveryDate ? new Date(salesOrderData.DeliveryDate) : null,
        salesOrderData.RequiredByDate ? new Date(salesOrderData.RequiredByDate) : null,
        salesOrderData.DateReceived ? new Date(salesOrderData.DateReceived) : null,
        salesOrderData.ServiceTypeID ? parseInt(salesOrderData.ServiceTypeID) : null,
        salesOrderData.ExternalRefNo || null,
        salesOrderData.ExternalSupplierID ? parseInt(salesOrderData.ExternalSupplierID) : null,
        salesOrderData.OrderStatusID ? parseInt(salesOrderData.OrderStatusID) : null,
        salesOrderData.ApplyTaxWithholdingAmount != null ? salesOrderData.ApplyTaxWithholdingAmount : null,
        salesOrderData.CurrencyID ? parseInt(salesOrderData.CurrencyID) : null,
        salesOrderData.SalesAmount ? parseFloat(salesOrderData.SalesAmount) : null,
        salesOrderData.TaxesAndOtherCharges ? parseFloat(salesOrderData.TaxesAndOtherCharges) : null,
        salesOrderData.Total ? parseFloat(salesOrderData.Total) : null,
        salesOrderData.FormCompletedYN != null ? salesOrderData.FormCompletedYN : null,
        salesOrderData.FileName || null,
        salesOrderData.FileContent || null, // Added FileContent parameter
        salesOrderData.ChangedByID ? parseInt(salesOrderData.ChangedByID) : null
      ];

      const [result] = await pool.query(
        'CALL SP_SalesOrder_RUD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? `${action} operation successful` : 'Operation failed'),
        data: action === 'SELECT' ? result[0]?.[0] || null : null,
        salesOrderId: salesOrderData.SalesOrderID,
        newSalesOrderId: null
      };
    } catch (error) {
      console.error(`Database error in ${action} operation:`, error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #executeInsertStoredProcedure(salesOrderData) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        salesOrderData.SalesQuotationID ? parseInt(salesOrderData.SalesQuotationID) : null,
        salesOrderData.CreatedByID ? parseInt(salesOrderData.CreatedByID) : null,
        salesOrderData.ShippingPriorityID ? parseInt(salesOrderData.ShippingPriorityID) : null,
        salesOrderData.PostingDate ? new Date(salesOrderData.PostingDate) : null
      ];

      const [result] = await pool.query(
        'CALL sp_InsertSalesOrderAndParcels(?, ?, ?, ?, @p_NewSalesOrderID, @p_Result, @p_Message)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_NewSalesOrderID AS newSalesOrderId, @p_Result AS result, @p_Message AS message'
      );

      return {
        success: outParams.result === 1,
        message: outParams.message || (outParams.result === 1 ? 'Sales Order and Parcels inserted successfully' : 'Operation failed'),
        data: null,
        salesOrderId: null,
        newSalesOrderId: outParams.newSalesOrderId
      };
    } catch (error) {
      console.error('Database error in sp_InsertSalesOrderAndParcels:', error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  static async #validateForeignKeys(salesOrderData, action) {
    const pool = await poolPromise;
    const errors = [];

    if (action === 'INSERT' || action === 'UPDATE') {
      if (salesOrderData.SalesQuotationID) {
        const [quotationCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsalesquotation WHERE SalesQuotationID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderData.SalesQuotationID)]
        );
        if (quotationCheck.length === 0) errors.push(`SalesQuotationID ${salesOrderData.SalesQuotationID} does not exist or is deleted`);
      }
      if (salesOrderData.SalesRFQID) {
        const [rfqCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsalesrfq WHERE SalesRFQID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderData.SalesRFQID)]
        );
        if (rfqCheck.length === 0) errors.push(`SalesRFQID ${salesOrderData.SalesRFQID} does not exist or is deleted`);
      }
      if (salesOrderData.CompanyID) {
        const [companyCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblcompany WHERE CompanyID = ?',
          [parseInt(salesOrderData.CompanyID)]
        );
        if (companyCheck.length === 0) errors.push(`CompanyID ${salesOrderData.CompanyID} does not exist`);
      }
      if (salesOrderData.CustomerID) {
        const [customerCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblcustomer WHERE CustomerID = ?',
          [parseInt(salesOrderData.CustomerID)]
        );
        if (customerCheck.length === 0) errors.push(`CustomerID ${salesOrderData.CustomerID} does not exist`);
      }
      if (salesOrderData.SupplierID) {
        const [supplierCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsupplier WHERE SupplierID = ?',
          [parseInt(salesOrderData.SupplierID)]
        );
        if (supplierCheck.length === 0) errors.push(`SupplierID ${salesOrderData.SupplierID} does not exist`);
      }
      if (salesOrderData.OriginAddressID) {
        const [originAddressCheck] = await pool.query(
          'SELECT 1 FROM dbo_tbladdresses WHERE AddressID = ?',
          [parseInt(salesOrderData.OriginAddressID)]
        );
        if (originAddressCheck.length === 0) errors.push(`OriginAddressID ${salesOrderData.OriginAddressID} does not exist`);
      }
      if (salesOrderData.DestinationAddressID) {
        const [destinationAddressCheck] = await pool.query(
          'SELECT 1 FROM dbo_tbladdresses WHERE AddressID = ?',
          [parseInt(salesOrderData.DestinationAddressID)]
        );
        if (destinationAddressCheck.length === 0) errors.push(`DestinationAddressID ${salesOrderData.DestinationAddressID} does not exist`);
      }
      if (salesOrderData.BillingAddressID) {
        const [billingAddressCheck] = await pool.query(
          'SELECT 1 FROM dbo_tbladdresses WHERE AddressID = ?',
          [parseInt(salesOrderData.BillingAddressID)]
        );
        if (billingAddressCheck.length === 0) errors.push(`BillingAddressID ${salesOrderData.BillingAddressID} does not exist`);
      }
      if (salesOrderData.CollectionAddressID) {
        const [collectionAddressCheck] = await pool.query(
          'SELECT 1 FROM dbo_tbladdresses WHERE AddressID = ?',
          [parseInt(salesOrderData.CollectionAddressID)]
        );
        if (collectionAddressCheck.length === 0) errors.push(`CollectionAddressID ${salesOrderData.CollectionAddressID} does not exist`);
      }
      if (salesOrderData.ShippingPriorityID) {
        const [shippingPriorityCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblmailingpriority WHERE MailingPriorityID = ?',
          [parseInt(salesOrderData.ShippingPriorityID)]
        );
        if (shippingPriorityCheck.length === 0) errors.push(`ShippingPriorityID ${salesOrderData.ShippingPriorityID} does not exist`);
      }
      if (salesOrderData.ServiceTypeID) {
        const [serviceTypeCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblservicetype WHERE ServiceTypeID = ?',
          [parseInt(salesOrderData.ServiceTypeID)]
        );
        if (serviceTypeCheck.length === 0) errors.push(`ServiceTypeID ${salesOrderData.ServiceTypeID} does not exist`);
      }
      if (salesOrderData.ExternalSupplierID) {
        const [extSupplierCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblsupplier WHERE SupplierID = ?',
          [parseInt(salesOrderData.ExternalSupplierID)]
        );
        if (extSupplierCheck.length === 0) errors.push(`ExternalSupplierID ${salesOrderData.ExternalSupplierID} does not exist`);
      }
      if (salesOrderData.OrderStatusID) {
        const [orderStatusCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblorderstatus WHERE OrderStatusID = ?',
          [parseInt(salesOrderData.OrderStatusID)]
        );
        if (orderStatusCheck.length === 0) errors.push(`OrderStatusID ${salesOrderData.OrderStatusID} does not exist`);
      }
      if (salesOrderData.CurrencyID) {
        const [currencyCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblcurrency WHERE CurrencyID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)',
          [parseInt(salesOrderData.CurrencyID)]
        );
        if (currencyCheck.length === 0) errors.push(`CurrencyID ${salesOrderData.CurrencyID} does not exist or is deleted`);
      }
      if (salesOrderData.ChangedByID || salesOrderData.CreatedByID) {
        const personID = parseInt(salesOrderData.ChangedByID || salesOrderData.CreatedByID);
        const [createdByCheck] = await pool.query(
          'SELECT 1 FROM dbo_tblperson WHERE PersonID = ?',
          [personID]
        );
        if (createdByCheck.length === 0) errors.push(`ChangedByID/CreatedByID ${personID} does not exist`);
      }
    }

    if (action === 'DELETE' && salesOrderData.ChangedByID) {
      const [createdByCheck] = await pool.query(
        'SELECT 1 FROM dbo_tblperson WHERE PersonID = ?',
        [parseInt(salesOrderData.ChangedByID)]
      );
      if (createdByCheck.length === 0) errors.push(`ChangedByID ${salesOrderData.ChangedByID} does not exist`);
    }

    return errors.length > 0 ? errors.join('; ') : null;
  }

  static async createSalesOrder(salesOrderData) {
    const requiredFields = ['SalesQuotationID', 'CreatedByID'];
    const missingFields = requiredFields.filter(field => !salesOrderData[field]);
    if (missingFields.length > 0) {
      return {
        success: false,
        message: `${missingFields.join(', ')} are required`,
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(salesOrderData, 'INSERT');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      };
    }

    return await this.#executeInsertStoredProcedure(salesOrderData);
  }

  static async updateSalesOrder(salesOrderData) {
    if (!salesOrderData.SalesOrderID) {
      return {
        success: false,
        message: 'SalesOrderID is required for UPDATE',
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      };
    }

    if (!salesOrderData.ChangedByID) {
      return {
        success: false,
        message: 'ChangedByID is required for UPDATE',
        data: null,
        salesOrderId: salesOrderData.SalesOrderID,
        newSalesOrderId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(salesOrderData, 'UPDATE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesOrderId: salesOrderData.SalesOrderID,
        newSalesOrderId: null
      };
    }

    return await this.#executeRUDStoredProcedure('UPDATE', salesOrderData);
  }

  static async deleteSalesOrder(salesOrderData) {
    if (!salesOrderData.SalesOrderID) {
      return {
        success: false,
        message: 'SalesOrderID is required for DELETE',
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      };
    }

    if (!salesOrderData.ChangedByID) {
      return {
        success: false,
        message: 'ChangedByID is required for DELETE',
        data: null,
        salesOrderId: salesOrderData.SalesOrderID,
        newSalesOrderId: null
      };
    }

    const fkErrors = await this.#validateForeignKeys(salesOrderData, 'DELETE');
    if (fkErrors) {
      return {
        success: false,
        message: `Validation failed: ${fkErrors}`,
        data: null,
        salesOrderId: salesOrderData.SalesOrderID,
        newSalesOrderId: null
      };
    }

    return await this.#executeRUDStoredProcedure('DELETE', salesOrderData);
  }

  static async getSalesOrder(salesOrderData) {
    if (!salesOrderData.SalesOrderID) {
      return {
        success: false,
        message: 'SalesOrderID is required for SELECT',
        data: null,
        salesOrderId: null,
        newSalesOrderId: null
      };
    }

    return await this.#executeRUDStoredProcedure('SELECT', salesOrderData);
  }

  static async getAllSalesOrders(paginationData) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        parseInt(paginationData.PageNumber) || 1,
        parseInt(paginationData.PageSize) || 10,
        paginationData.SortColumn || 'SalesOrderID',
        paginationData.SortDirection || 'ASC',
        paginationData.FromDate ? new Date(paginationData.FromDate) : null,
        paginationData.ToDate ? new Date(paginationData.ToDate) : null,
      ];

      const [resultSets] = await pool.query(
        'CALL SP_GetAllSalesOrder(?, ?, ?, ?, ?, ?, @p_Result, @p_Message)',
        queryParams
      );

      const [[{ p_Result, p_Message }]] = await pool.query(
        'SELECT @p_Result AS p_Result, @p_Message AS p_Message'
      );

      return {
        success: p_Result === 1,
        message: p_Message || 'Sales orders fetched.',
        data: resultSets[0] || [],
        totalRecords: resultSets[0]?.length || 0, // Adjust this if you return count separately
      };
    } catch (error) {
      console.error('Database error in getAllSalesOrders:', error);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }
  }
}

module.exports = SalesOrderModel;