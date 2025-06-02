const mysql = require('mysql2/promise');
const poolPromise = require('../config/db.config');

async function getPurchaseRFQDetails(purchaseRFQID) {
  const pool = await poolPromise;
  try {
    // Validate PurchaseRFQID
    if (!purchaseRFQID || isNaN(purchaseRFQID)) {
      throw new Error('Invalid PurchaseRFQID provided');
    }

    // Check if PurchaseRFQID exists
    const [exists] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM dbo_tblpurchaserfq
       WHERE PurchaseRFQID = ? AND (IsDeleted = 0 OR IsDeleted IS NULL)`,
      [purchaseRFQID]
    );

    if (exists[0].count === 0) {
      throw new Error(`No active Purchase RFQ found for PurchaseRFQID=${purchaseRFQID}`);
    }

    // Call stored procedure
    await pool.query(
      `CALL SP_ManagePurchaseRFQ(?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewPurchaseRFQID)`,
      ['SELECT', purchaseRFQID, null, null, null, null]
    );

    // Retrieve output parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_NewPurchaseRFQID AS p_NewPurchaseRFQID`
    );

    const { p_Result, p_Message } = outResult[0] || {};

    console.log(`SP_ManagePurchaseRFQ output for PurchaseRFQID=${purchaseRFQID}:`, {
      p_Result,
      p_Message,
      p_NewPurchaseRFQID: outResult[0]?.p_NewPurchaseRFQID
    });

    // SP_ManagePurchaseRFQ uses p_Result = 1 for success
    if (p_Result !== 1 || !p_Message) {
      throw new Error(p_Message || `Failed to fetch Purchase RFQ details for PurchaseRFQID=${purchaseRFQID}`);
    }

    // Fetch the recordset
    const [result] = await pool.query(
      `SELECT 
        rfq.*, c.CompanyName, cust.CustomerName
      FROM dbo_tblpurchaserfq rfq
      LEFT JOIN dbo_tblcompany c ON rfq.CompanyID = c.CompanyID
      LEFT JOIN dbo_tblcustomer cust ON rfq.CustomerID = cust.CustomerID
      WHERE rfq.PurchaseRFQID = ? AND (rfq.IsDeleted = 0 OR rfq.IsDeleted IS NULL)`,
      [purchaseRFQID]
    );

    if (!result || result.length === 0) {
      throw new Error(`No Purchase RFQ data returned for PurchaseRFQID=${purchaseRFQID}`);
    }

    const rfqDetails = result[0];
    const parcels = await getPurchaseRFQParcels(purchaseRFQID);

    console.log(`Fetched RFQ details for PurchaseRFQID=${purchaseRFQID}:`, rfqDetails);
    console.log(`Fetched parcels for PurchaseRFQID=${purchaseRFQID}:`, parcels);

    return { rfqDetails, parcels };
  } catch (error) {
    console.error(`Error in getPurchaseRFQDetails for PurchaseRFQID=${purchaseRFQID}:`, error.message, error.stack);
    throw new Error(`Error fetching Purchase RFQ: ${error.message}`);
  }
}

async function getPurchaseRFQParcels(purchaseRFQID) {
  const pool = await poolPromise;
  try {
    // Call stored procedure
    await pool.query(
      `CALL SP_ManagePurchaseRFQParcel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)`,
      ['SELECT', null, purchaseRFQID, null, null, null, null, null, null, null, null, null, null]
    );

    // Retrieve output parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message`
    );

    const { p_Result, p_Message } = outResult[0] || {};

    console.log(`SP_ManagePurchaseRFQParcel output for PurchaseRFQID=${purchaseRFQID}:`, {
      p_Result,
      p_Message
    });

    // SP_ManagePurchaseRFQParcel uses p_Result = 0 for success
    if (p_Result !== 0 || !p_Message) {
      throw new Error(p_Message || `Failed to fetch Purchase RFQ parcels for PurchaseRFQID=${purchaseRFQID}`);
    }

    // Fetch parcels
    const [parcelsResult] = await pool.query(
      `SELECT 
        p.PurchaseRFQParcelID, p.PurchaseRFQID, pr.Series AS PurchaseRFQSeries,
        p.ParcelID, p.ItemID, i.ItemName, p.LineItemNumber, p.ItemQuantity,
        p.UOMID, u.UOM AS UOMName, p.Rate, p.Amount, p.LineNumber,
        p.CreatedByID, p.CreatedDateTime, p.IsDeleted, p.DeletedDateTime, p.DeletedByID
      FROM dbo_tblpurchaserfqparcel p
      LEFT JOIN dbo_tblitem i ON p.ItemID = i.ItemID
      LEFT JOIN dbo_tbluom u ON p.UOMID = u.UOMID
      LEFT JOIN dbo_tblpurchaserfq pr ON p.PurchaseRFQID = pr.PurchaseRFQID
      WHERE p.PurchaseRFQID = ? AND (p.IsDeleted = 0 OR p.IsDeleted IS NULL)`,
      [purchaseRFQID]
    );

    let parcels = parcelsResult || [];

    console.log(`Fetched parcels for PurchaseRFQID=${purchaseRFQID}:`);
    console.log(`Number of parcels (before filtering): ${parcels.length}`);
    console.log('Parcel details (before filtering):', parcels.map(p => ({
      PurchaseRFQParcelID: p.PurchaseRFQParcelID,
      PurchaseRFQID: p.PurchaseRFQID,
      ItemName: p.ItemName,
      ItemQuantity: p.ItemQuantity,
      UOMName: p.UOMName
    })));

    // Filter parcels (redundant but kept for safety)
    parcels = parcels.filter(parcel => parcel.PurchaseRFQID === purchaseRFQID);

    console.log(`Number of parcels (after filtering): ${parcels.length}`);
    console.log('Parcel details (after filtering):', parcels.map(p => ({
      PurchaseRFQParcelID: p.PurchaseRFQParcelID,
      PurchaseRFQID: p.PurchaseRFQID,
      ItemName: p.ItemName,
      ItemQuantity: p.ItemQuantity,
      UOMName: p.UOMName
    })));

    return parcels;
  } catch (error) {
    console.error(`Error in getPurchaseRFQParcels for PurchaseRFQID=${purchaseRFQID}:`, error.message, error.stack);
    throw new Error(`Error fetching Purchase RFQ parcels: ${error.message}`);
  }
}

async function getSupplierDetails(supplierID) {
  const pool = await poolPromise;
  try {
    // Call stored procedure
    await pool.query(
      `CALL SP_ManageSupplier(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message)`,
      ['SELECT', supplierID, null, null, null, null, null, null, null, null, null, null, null, null]
    );

    // Retrieve output parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message`
    );

    const { p_Result, p_Message } = outResult[0] || {};

    console.log(`SP_ManageSupplier output for SupplierID=${supplierID}:`, {
      p_Result,
      p_Message
    });

    // SP_ManageSupplier uses p_Result = 1 for success
    if (!p_Result || p_Result !== 1 || !p_Message) {
      throw new Error(p_Message || `Failed to fetch supplier details for SupplierID=${supplierID}`);
    }

    // Fetch supplier details
    const [result] = await pool.query(
      `SELECT 
        s.*, st.SupplierType, a.AddressTitle, a.City, c.CurrencyName, comp.CompanyName
      FROM dbo_tblsupplier s
      LEFT JOIN dbo_tblsuppliertype st ON s.SupplierTypeID = st.SupplierTypeID
      LEFT JOIN dbo_tbladdresses a ON s.SupplierAddressID = a.AddressID
      LEFT JOIN dbo_tblcurrency c ON s.BillingCurrencyID = c.CurrencyID
      LEFT JOIN dbo_tblcompany comp ON s.CompanyID = comp.CompanyID
      WHERE s.SupplierID = ? AND (s.IsDeleted = 0 OR s.IsDeleted IS NULL)`,
      [supplierID]
    );

    if (!result || result.length === 0) {
      throw new Error(`No supplier found for SupplierID=${supplierID}`);
    }

    return result[0];
  } catch (error) {
    console.error(`Error in getSupplierDetails for SupplierID=${supplierID}:`, error.message, error.stack);
    throw new Error(`Error fetching supplier details: ${error.message}`);
  }
}

async function createSupplierQuotation(purchaseRFQID, supplierID, createdByID) {
  const pool = await poolPromise;
  try {
    // Call stored procedure
    await pool.query(
      `CALL SP_ManageSupplierQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSupplierQuotationID)`,
      ['INSERT', null, supplierID, purchaseRFQID, null, null, createdByID, null, null, null, null, null, null, null, null]
    );

    // Retrieve output parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_NewSupplierQuotationID AS p_NewSupplierQuotationID`
    );

    const { p_Result, p_Message, p_NewSupplierQuotationID } = outResult[0] || {};

    console.log(`SP_ManageSupplierQuotation output for INSERT:`, {
      p_Result,
      p_Message,
      p_NewSupplierQuotationID
    });

    // SP_ManageSupplierQuotation uses p_Result = 1 for success
    if (!p_Result || p_Result !== 1 || !p_Message || !p_NewSupplierQuotationID) {
      throw new Error(p_Message || 'Failed to create supplier quotation');
    }

    return p_NewSupplierQuotationID;
  } catch (error) {
    console.error(`Error in createSupplierQuotation for PurchaseRFQID=${purchaseRFQID}, SupplierID=${supplierID}:`, error.message, error.stack);
    throw new Error(`Error creating supplier quotation: ${error.message}`);
  }
}

async function getSupplierQuotationDetails(supplierQuotationID, supplierID) {
  const pool = await poolPromise;
  try {
    // Call stored procedure
    await pool.query(
      `CALL SP_ManageSupplierQuotation(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_Result, @p_Message, @p_NewSupplierQuotationID)`,
      ['SELECT', supplierQuotationID, supplierID, null, null, null, null, null, null, null, null, null, null, null, null]
    );

    // Retrieve output parameters
    const [outResult] = await pool.query(
      `SELECT @p_Result AS p_Result, @p_Message AS p_Message, @p_NewSupplierQuotationID AS p_NewSupplierQuotationID`
    );

    const { p_Result, p_Message } = outResult[0] || {};

    console.log(`SP_ManageSupplierQuotation output for SupplierQuotationID=${supplierQuotationID}:`, {
      p_Result,
      p_Message,
      p_NewSupplierQuotationID: outResult[0]?.p_NewSupplierQuotationID
    });

    // SP_ManageSupplierQuotation uses p_Result = 1 for success
    if (!p_Result || p_Result !== 1 || !p_Message) {
      throw new Error(p_Message || `Failed to fetch supplier quotation details for SupplierQuotationID=${supplierQuotationID}`);
    }

    // Fetch quotation details
    const [quotationResult] = await pool.query(
      `SELECT 
        sq.*, c.CompanyName, s.SupplierName, cu.CustomerName, curr.CurrencyName,
        CONCAT(orig.AddressLine1, ', ', orig.City, ', ', orig.Country) AS OriginAddress,
        CONCAT(dest.AddressLine1, ', ', dest.City, ', ', dest.Country) AS DestinationAddress,
        CONCAT(bill.AddressLine1, ', ', bill.City, ', ', bill.Country) AS BillingAddress,
        CONCAT(coll.AddressLine1, ', ', coll.City, ', ', coll.Country) AS CollectionAddress,
        st.ServiceType, sp.PriorityName AS ShippingPriority,
        CONCAT(u.FirstName, ' ', u.LastName) AS CreatedByName
      FROM dbo_tblsupplierquotation sq
      LEFT JOIN dbo_tblcompany c ON sq.CompanyID = c.CompanyID
      LEFT JOIN dbo_tblsupplier s ON sq.SupplierID = s.SupplierID
      LEFT JOIN dbo_tblcustomer cu ON sq.CustomerID = cu.CustomerID
      LEFT JOIN dbo_tblcurrency curr ON sq.CurrencyID = curr.CurrencyID
      LEFT JOIN dbo_tbladdresses orig ON sq.OriginAddressID = orig.AddressID
      LEFT JOIN dbo_tbladdresses dest ON sq.DestinationAddressID = dest.AddressID
      LEFT JOIN dbo_tbladdresses bill ON sq.BillingAddressID = bill.AddressID
      LEFT JOIN dbo_tbladdresses coll ON sq.CollectionAddressID = coll.AddressID
      LEFT JOIN dbo_tblservicetype st ON sq.ServiceTypeID = st.ServiceTypeID
      LEFT JOIN dbo_tblmailingpriority sp ON sq.ShippingPriorityID = sp.MailingPriorityID
      LEFT JOIN dbo_tblperson u ON sq.CreatedByID = u.PersonID
      WHERE sq.SupplierQuotationID = ? AND sq.SupplierID = ? AND (sq.IsDeleted = 0 OR sq.IsDeleted IS NULL)`,
      [supplierQuotationID, supplierID]
    );

    if (!quotationResult || quotationResult.length === 0) {
      throw new Error(`No supplier quotation found for SupplierQuotationID=${supplierQuotationID}`);
    }

    const quotationDetails = quotationResult[0];

    // Fetch quotation parcels
    const [parcelsResult] = await pool.query(
      `SELECT 
        sqp.*, i.ItemName, u.UOM AS UOMName
      FROM dbo_tblsupplierquotationparcel sqp
      LEFT JOIN dbo_tblitem i ON sqp.ItemID = i.ItemID
      LEFT JOIN dbo_tbluom u ON sqp.UOMID = u.UOMID
      WHERE sqp.SupplierQuotationID = ? AND (sqp.IsDeleted = 0 OR sqp.IsDeleted IS NULL)`,
      [supplierQuotationID]
    );

    const quotationParcels = parcelsResult || [];

    return { quotationDetails, quotationParcels };
  } catch (error) {
    console.error(`Error in getSupplierQuotationDetails for SupplierQuotationID=${supplierQuotationID}:`, error.message, error.stack);
    throw new Error(`Error fetching supplier quotation details: ${error.message}`);
  }
}

module.exports = {
  getPurchaseRFQDetails,
  getSupplierDetails,
  createSupplierQuotation,
  getSupplierQuotationDetails,
};