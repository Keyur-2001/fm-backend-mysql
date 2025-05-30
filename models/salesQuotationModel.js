const poolPromise = require('../config/db.config');

class SalesQuotationModel {
  // Get all Sales Quotations
  static async getAllSalesQuotations({
    pageNumber = 1,
    pageSize = 10,
    sortColumn = 'SalesQuotationID',
    sortDirection = 'ASC',
    fromDate = null,
    toDate = null,
    status = null,
    customerId = null,
    supplierId = null
  }) {
    try {
      const pool = await poolPromise;

      // Validate parameters
      const queryParams = [
        pageNumber > 0 ? pageNumber : 1,
        pageSize > 0 ? pageSize : 10,
        sortColumn || 'SalesQuotationID',
        sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        fromDate || null,
        toDate || null,
        status || null,
        customerId ? parseInt(customerId) : null,
        supplierId ? parseInt(supplierId) : null
      ];

      // Call SP_GetAllSalesQuotation
      const [result] = await pool.query(
        'CALL SP_GetAllSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, @p_TotalRecords)',
        queryParams
      );

      // Retrieve OUT parameter
      const [[{ totalRecords }]] = await pool.query('SELECT @p_TotalRecords AS totalRecords');

      return {
        data: result[0],
        totalRecords: totalRecords || 0
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Create a new Sales Quotation
  static async createSalesQuotation(data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'INSERT',
        null, // p_SalesQuotationID
        data.SalesRFQID || null,
        data.PurchaseRFQID,
        data.supplierId || null,
        data.Status || 'Pending',
        data.originAddressId || null,
        data.collectionAddressId || null,
        data.billingAddressId || null,
        data.destinationAddressId || null,
        data.collectionWarehouseId || null,
        data.postingDate || null,
        data.deliveryDate || null,
        data.requiredByDate || null,
        data.dateReceived || null,
        data.serviceTypeId || null,
        data.externalRefNo || null,
        data.externalSupplierId || null,
        data.customerId || null,
        data.companyId || null,
        data.terms || null,
        data.packagingRequiredYN || 0,
        data.collectFromSupplierYN || 0,
        data.salesQuotationCompletedYN || 0,
        data.shippingPriorityId || null,
        data.validTillDate || null,
        data.currencyId || null,
        data.supplierContactPersonId || null,
        data.isDeliveryOnly || 0,
        data.taxesAndOtherCharges || 0,
        data.CreatedByID,
        null // p_DeletedByID
      ];

      // Call SP_ManageSalesQuotation
      const [result] = await pool.query(
        'CALL SP_ManageSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSalesQuotationID)',
        queryParams
      );

      // Retrieve OUT parameters
      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message, @p_NewSalesQuotationID AS newSalesQuotationId'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to create Sales Quotation');
      }

      return {
        newSalesQuotationId: outParams.newSalesQuotationId,
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Get a single Sales Quotation by ID
  static async getSalesQuotationById(id) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'SELECT',
        id,
        null, // p_SalesRFQID
        null, // p_PurchaseRFQID
        null, // p_SupplierID
        null, // p_Status
        null, // p_OriginAddressID
        null, // p_CollectionAddressID
        null, // p_BillingAddressID
        null, // p_DestinationAddressID
        null, // p_CollectionWarehouseID
        null, // p_PostingDate
        null, // p_DeliveryDate
        null, // p_RequiredByDate
        null, // p_DateReceived
        null, // p_ServiceTypeID
        null, // p_ExternalRefNo
        null, // p_ExternalSupplierID
        null, // p_CustomerID
        null, // p_CompanyID
        null, // p_Terms
        null, // p_PackagingRequiredYN
        null, // p_CollectFromSupplierYN
        null, // p_SalesQuotationCompletedYN
        null, // p_ShippingPriorityID
        null, // p_ValidTillDate
        null, // p_CurrencyID
        null, // p_SupplierContactPersonID
        null, // p_IsDeliveryOnly
        null, // p_TaxesAndOtherCharges
        null, // p_CreatedByID
        null // p_DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSalesQuotationID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message, @p_NewSalesQuotationID AS newSalesQuotationId'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Sales Quotation not found or deleted');
      }

      return result[0][0] || null;
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Update a Sales Quotation
  static async updateSalesQuotation(id, data) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'UPDATE',
        id,
        data.SalesRFQID || null,
        data.PurchaseRFQID || null,
        data.supplierId || null,
        data.Status || null,
        data.originAddressId || null,
        data.collectionAddressId || null,
        data.billingAddressId || null,
        data.destinationAddressId || null,
        data.collectionWarehouseId || null,
        data.postingDate || null,
        data.deliveryDate || null,
        data.requiredByDate || null,
        data.dateReceived || null,
        data.serviceTypeId || null,
        data.externalRefNo || null,
        data.externalSupplierId || null,
        data.customerId || null,
        data.companyId || null,
        data.terms || null,
        data.packagingRequiredYN || null,
        data.collectFromSupplierYN || null,
        data.salesQuotationCompletedYN || null,
        data.shippingPriorityId || null,
        data.validTillDate || null,
        data.currencyId || null,
        data.supplierContactPersonId || null,
        data.isDeliveryOnly || null,
        data.TaxesAndOtherCharges || null,
        data.CreatedByID || null,
        null // p_DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSalesQuotationID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to update Sales Quotation');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }

  // Delete a Sales Quotation
  static async deleteSalesQuotation(id, DeletedByID) {
    try {
      const pool = await poolPromise;

      const queryParams = [
        'DELETE',
        id,
        null, // p_SalesRFQID
        null, // p_PurchaseRFQID
        null, // p_SupplierID
        null, // p_Status
        null, // p_OriginAddressID
        null, // p_CollectionAddressID
        null, // p_BillingAddressID
        null, // p_DestinationAddressID
        null, // p_CollectionWarehouseID
        null, // p_PostingDate
        null, // p_DeliveryDate
        null, // p_RequiredByDate
        null, // p_DateReceived
        null, // p_ServiceTypeID
        null, // p_ExternalRefNo
        null, // p_ExternalSupplierID
        null, // p_CustomerID
        null, // p_CompanyID
        null, // p_Terms
        null, // p_PackagingRequiredYN
        null, // p_CollectFromSupplierYN
        null, // p_SalesQuotationCompletedYN
        null, // p_ShippingPriorityID
        null, // p_ValidTillDate
        null, // p_CurrencyID
        null, // p_SupplierContactPersonID
        null, // p_IsDeliveryOnly
        null, // p_TaxesAndOtherCharges
        null, // p_CreatedByID
        DeletedByID
      ];

      const [result] = await pool.query(
        'CALL SP_ManageSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSalesQuotationID)',
        queryParams
      );

      const [[outParams]] = await pool.query(
        'SELECT @p_Result AS result, @p_Message AS message'
      );

      if (outParams.result !== 1) {
        throw new Error(outParams.message || 'Failed to delete Sales Quotation');
      }

      return {
        message: outParams.message
      };
    } catch (err) {
      throw new Error(`Database error: ${err.message}`);
    }
  }
}

module.exports = SalesQuotationModel;