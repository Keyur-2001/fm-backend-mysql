const {
  createSalesQuotationFromPurchaseRFQ,
  manageSalesQuotation,
} = require('../models/salesQuotationModel');

// Create a new sales quotation
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
      return res.status(400).json({ success: false, message: 'PurchaseRFQID and CreatedByID are required' });
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
        success: true,
        message: result.message,
        newSalesQuotationID: result.newSalesQuotationID,
      });
    } else {
      return res.status(400).json({ success: false, message: result.message || 'Failed to create sales quotation' });
    }
  } catch (error) {
    console.error('Error creating Sales Quotation:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// Update a sales quotation by ID
const updateSalesQuotation = async (req, res) => {
  try {
    const SalesQuotationID = parseInt(req.params.id, 10);
    if (isNaN(SalesQuotationID)) {
      return res.status(400).json({ success: false, message: 'Valid SalesQuotationID is required' });
    }

    const {
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

    if (!UpdatedByID) {
      return res.status(400).json({ success: false, message: 'UpdatedByID is required' });
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
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message || 'Failed to update sales quotation' });
    }
  } catch (error) {
    console.error(`Error updating Sales Quotation ID ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// Delete a sales quotation by ID
const deleteSalesQuotation = async (req, res) => {
  try {
    const SalesQuotationID = parseInt(req.params.id, 10);
    if (isNaN(SalesQuotationID)) {
      return res.status(400).json({ success: false, message: 'Valid SalesQuotationID is required' });
    }

    const { DeletedByID, DebugMode = 0 } = req.body;

    if (!DeletedByID) {
      return res.status(400).json({ success: false, message: 'DeletedByID is required' });
    }

    const result = await manageSalesQuotation({
      Action: 'DELETE',
      SalesQuotationID,
      DeletedByID,
      DebugMode,
    });

    if (result.result === 1) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message || 'Failed to delete sales quotation' });
    }
  } catch (error) {
    console.error(`Error deleting Sales Quotation ID ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// Get a sales quotation by ID
const getSalesQuotation = async (req, res) => {
  try {
    const SalesQuotationID = parseInt(req.params.id, 10);
    if (isNaN(SalesQuotationID)) {
      return res.status(400).json({ success: false, message: 'Valid SalesQuotationID is required' });
    }

    const { DebugMode = 0 } = req.query;

    const result = await manageSalesQuotation({
      Action: 'SELECT',
      SalesQuotationID,
      DebugMode,
    });

    if (result.result === 1) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.recordset,
      });
    } else {
      return res.status(400).json({ success: false, message: result.message || 'Failed to fetch sales quotation' });
    }
  } catch (error) {
    console.error(`Error fetching Sales Quotation ID ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  createSalesQuotation,
  updateSalesQuotation,
  deleteSalesQuotation,
  getSalesQuotation,
};