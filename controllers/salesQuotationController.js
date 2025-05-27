const {
  createSalesQuotationFromPurchaseRFQ,
  manageSalesQuotation,
} = require('../models/salesQuotationModel');

// INSERT
const createSalesQuotation = async (req, res) => {
  try {
    const {
      PurchaseRFQID,
      CreatedByID,
      SalesRFQID,
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
      DebugMode = 0,
    } = req.body;

    if (!PurchaseRFQID || !CreatedByID) {
      return res.status(400).json({ error: 'PurchaseRFQID and CreatedByID are required' });
    }

    const result = await createSalesQuotationFromPurchaseRFQ({
      PurchaseRFQID,
      CreatedByID,
      SalesRFQID,
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
      DebugMode,
    });

    if (result.result === 1) {
      return res.status(201).json({
        message: result.message,
        newSalesQuotationID: result.newSalesQuotationID,
      });
    } else {
      return res.status(400).json({ error: result.message || 'Failed to create sales quotation' });
    }
  } catch (error) {
    console.error('Error creating Sales Quotation:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// UPDATE
const updateSalesQuotation = async (req, res) => {
  try {
    const {
      SalesQuotationID,
      UpdatedByID,
      SalesRFQID,
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
      DebugMode = 0,
    } = req.body;

    if (!SalesQuotationID || !UpdatedByID) {
      return res.status(400).json({ error: 'SalesQuotationID and UpdatedByID are required' });
    }

    const result = await manageSalesQuotation({
      Action: 'UPDATE',
      SalesQuotationID,
      UpdatedByID,
      SalesRFQID,
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
      DebugMode,
    });

    if (result.result === 1) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ error: result.message || 'Failed to update sales quotation' });
    }
  } catch (error) {
    console.error('Error updating Sales Quotation:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// DELETE
const deleteSalesQuotation = async (req, res) => {
  try {
    const { SalesQuotationID, DeletedByID, DebugMode = 0 } = req.body;

    if (!SalesQuotationID || !DeletedByID) {
      return res.status(400).json({ error: 'SalesQuotationID and DeletedByID are required' });
    }

    const result = await manageSalesQuotation({
      Action: 'DELETE',
      SalesQuotationID,
      DeletedByID,
      DebugMode,
    });

    if (result.result === 1) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ error: result.message || 'Failed to delete sales quotation' });
    }
  } catch (error) {
    console.error('Error deleting Sales Quotation:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// SELECT
const getSalesQuotation = async (req, res) => {
  try {
    const { SalesQuotationID, DebugMode = 0 } = req.query;

    if (!SalesQuotationID) {
      return res.status(400).json({ error: 'SalesQuotationID is required' });
    }

    const result = await manageSalesQuotation({
      Action: 'SELECT',
      SalesQuotationID,
      DebugMode,
    });

    if (result.result === 1) {
      return res.status(200).json({
        message: result.message,
        data: result.recordset,
      });
    } else {
      return res.status(400).json({ error: result.message || 'Failed to fetch sales quotation' });
    }
  } catch (error) {
    console.error('Error fetching Sales Quotation:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  createSalesQuotation,
  updateSalesQuotation,
  deleteSalesQuotation,
  getSalesQuotation,
};