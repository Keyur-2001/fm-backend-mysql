const mysql = require('mysql2/promise');
const poolPromise = require('../config/db.config');

// INSERT from PurchaseRFQ
const createSalesQuotationFromPurchaseRFQ = async ({
  PurchaseRFQID,
  CreatedByID,
  SalesRFQID = null,
  SupplierID = null,
  Status = 'Pending',
  OriginAddressID = null,
  CollectionAddressID = null,
  BillingAddressID = null,
  DestinationAddressID = null,
  CollectionWarehouseID = null,
  PostingDate = null,
  DeliveryDate = null,
  RequiredByDate = null,
  DateReceived = null,
  ServiceTypeID = null,
  ExternalRefNo = null,
  ExternalSupplierID = null,
  CustomerID = null,
  CompanyID = null,
  Terms = null,
  PackagingRequiredYN = 0,
  CollectFromSupplierYN = 0,
  SalesQuotationCompletedYN = 0,
  ShippingPriorityID = null,
  ValidTillDate = null,
  CurrencyID = null,
  SupplierContactPersonID = null,
  IsDeliveryOnly = 0,
  TaxesAndOtherCharges = 0,
  DebugMode = 0,
}) => {
  const pool = await poolPromise;
  try {
    // Call the stored procedure with 32 input parameters
    await pool.query(
      `CALL SP_ManageSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSalesQuotationID)`,
      [
        'INSERT',
        null, // p_SalesQuotationID (null for INSERT)
        SalesRFQID,
        PurchaseRFQID,
        SupplierID,
        Status,
        OriginAddressID,
        CollectionAddressID,
        BillingAddressID,
        DestinationAddressID,
        CollectionWarehouseID,
        PostingDate,
        DeliveryDate,
        RequiredByDate,
        DateReceived,
        ServiceTypeID,
        ExternalRefNo,
        ExternalSupplierID,
        CustomerID,
        CompanyID,
        Terms,
        PackagingRequiredYN,
        CollectFromSupplierYN,
        SalesQuotationCompletedYN,
        ShippingPriorityID,
        ValidTillDate,
        CurrencyID,
        SupplierContactPersonID,
        IsDeliveryOnly,
        TaxesAndOtherCharges,
        CreatedByID,
        null, // p_DeletedByID (null for INSERT)
      ]
    );

    // Retrieve the OUT parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_NewSalesQuotationID AS p_NewSalesQuotationID`
    );

    const { p_Result, p_Message, p_NewSalesQuotationID } = outResult[0] || {};

    // Validate OUT parameters
    if (p_Result === null || p_Result === undefined || p_Message === null || p_Message === undefined) {
      throw new Error('Stored procedure failed to return valid OUT parameters');
    }

    return {
      result: p_Result,
      message: p_Message,
      newSalesQuotationID: p_NewSalesQuotationID,
    };
  } catch (error) {
    throw new Error(`Failed to create sales quotation: ${error.message}`);
  }
};

// MANAGE SalesQuotation (UPDATE, DELETE, SELECT)
const manageSalesQuotation = async ({
  Action,
  SalesQuotationID,
  UpdatedByID = null,
  DeletedByID = null,
  SalesRFQID = null,
  SupplierID = null,
  Status = null,
  OriginAddressID = null,
  CollectionAddressID = null,
  BillingAddressID = null,
  DestinationAddressID = null,
  CollectionWarehouseID = null,
  PostingDate = null,
  DeliveryDate = null,
  RequiredByDate = null,
  DateReceived = null,
  ServiceTypeID = null,
  ExternalRefNo = null,
  ExternalSupplierID = null,
  CustomerID = null,
  CompanyID = null,
  Terms = null,
  PackagingRequiredYN = null,
  CollectFromSupplierYN = null,
  SalesQuotationCompletedYN = null,
  ShippingPriorityID = null,
  ValidTillDate = null,
  CurrencyID = null,
  SupplierContactPersonID = null,
  IsDeliveryOnly = null,
  TaxesAndOtherCharges = null,
  DebugMode = 0,
}) => {
  const pool = await poolPromise;
  try {
    // Call the stored procedure with 32 input parameters
    const [result] = await pool.query(
      `CALL SP_ManageSalesQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSalesQuotationID)`,
      [
        Action,
        SalesQuotationID,
        SalesRFQID,
        null, // PurchaseRFQID (not used in UPDATE/DELETE/SELECT)
        SupplierID,
        Status,
        OriginAddressID,
        CollectionAddressID,
        BillingAddressID,
        DestinationAddressID,
        CollectionWarehouseID,
        PostingDate,
        DeliveryDate,
        RequiredByDate,
        DateReceived,
        ServiceTypeID,
        ExternalRefNo,
        ExternalSupplierID,
        CustomerID,
        CompanyID,
        Terms,
        PackagingRequiredYN,
        CollectFromSupplierYN,
        SalesQuotationCompletedYN,
        ShippingPriorityID,
        ValidTillDate,
        CurrencyID,
        SupplierContactPersonID,
        IsDeliveryOnly,
        TaxesAndOtherCharges,
        UpdatedByID,
        DeletedByID,
      ]
    );

    // Retrieve the OUT parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_NewSalesQuotationID AS p_NewSalesQuotationID`
    );

    const { p_Result, p_Message, p_NewSalesQuotationID } = outResult[0] || {};

    // Validate OUT parameters
    if (p_Result === null || p_Result === undefined || p_Message === null || p_Message === undefined) {
      throw new Error('Stored procedure failed to return valid OUT parameters');
    }

    // For SELECT, return the recordset from the first result set
    const recordset = Action === 'SELECT' ? result[0] : [];

    return {
      result: p_Result,
      message: p_Message,
      newSalesQuotationID: p_NewSalesQuotationID,
      recordset,
    };
  } catch (error) {
    throw new Error(`Failed to manage sales quotation: ${error.message}`);
  }
};

module.exports = {
  createSalesQuotationFromPurchaseRFQ,
  manageSalesQuotation,
};