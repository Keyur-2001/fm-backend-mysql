const { getPurchaseRFQDetails, getSupplierDetails, createSupplierQuotation, getSupplierQuotationDetails } = require('../models/sentPurchaseRFQToSuppliersModel');
const { generateRFQPDF } = require('../services/pdfGenerator');
const { sendRFQEmail } = require('../utils/emailSender');

async function sendRFQToSuppliers(req, res) {
  const { purchaseRFQID, supplierIDs, supplierQuotationIDs, createdByID } = req.body;

  // Detailed validation
  const errors = [];
  if (!purchaseRFQID || isNaN(purchaseRFQID)) errors.push('PurchaseRFQID is required and must be a number');
  if (!supplierIDs || !Array.isArray(supplierIDs) || supplierIDs.length === 0) {
    errors.push('supplierIDs is required and must be a non-empty array');
  }
  if (!createdByID || isNaN(createdByID)) errors.push('createdByID is required and must be a number');
  if (supplierQuotationIDs && (!Array.isArray(supplierQuotationIDs) || supplierQuotationIDs.length !== supplierIDs.length)) {
    errors.push('supplierQuotationIDs must be an array of the same length as supplierIDs if provided');
  }

  if (errors.length > 0) {
    console.warn(`Validation errors for PurchaseRFQID=${purchaseRFQID}:`, errors);
    return res.status(400).json({ success: false, message: errors.join('; ') });
  }

  try {
    console.log(`Processing RFQ for PurchaseRFQID=${purchaseRFQID}, SupplierIDs=${supplierIDs.join(',')}`);

    // Fetch Purchase RFQ details and parcels
    const { rfqDetails, parcels } = await getPurchaseRFQDetails(purchaseRFQID);

    console.log(`Parcels for PurchaseRFQID=${purchaseRFQID}:`);
    console.log(`Number of parcels: ${parcels.length}`);
    console.log('Parcel details:', parcels.map(p => ({
      PurchaseRFQParcelID: p.PurchaseRFQParcelID,
      PurchaseRFQID: p.PurchaseRFQID,
      ItemName: p.ItemName,
      ItemQuantity: p.ItemQuantity,
      UOMName: p.UOMName
    })));

    const results = [];
    for (let i = 0; i < supplierIDs.length; i++) {
      const supplierID = supplierIDs[i];
      let supplierQuotationID = supplierQuotationIDs ? supplierQuotationIDs[i] : null;

      try {
        console.log(`Processing SupplierID=${supplierID}, SupplierQuotationID=${supplierQuotationID || 'new'}`);

        // Fetch supplier details
        const supplier = await getSupplierDetails(supplierID);
        if (!supplier.SupplierEmail) {
          console.warn(`No email for SupplierID=${supplierID}`);
          results.push({ supplierID, supplierQuotationID, success: false, message: 'Supplier email not found.' });
          continue;
        }

        // Create new supplier quotation if not provided
        if (!supplierQuotationID) {
          supplierQuotationID = await createSupplierQuotation(purchaseRFQID, supplierID, createdByID);
        }

        // Fetch supplier quotation details
        const { quotationDetails, quotationParcels } = await getSupplierQuotationDetails(supplierQuotationID, supplierID);

        // Generate PDF buffer
        console.log(`Generating PDF for SupplierID=${supplierID}`);
        const pdfBuffer = await generateRFQPDF(rfqDetails, parcels, supplier, quotationDetails, quotationParcels);

        // Send email with PDF buffer
        console.log(`Sending email to ${supplier.SupplierEmail} for RFQ ${rfqDetails.Series}`);
        const emailResult = await sendRFQEmail(supplier.SupplierEmail, rfqDetails.Series, pdfBuffer);
        console.log(`Email result for SupplierID=${supplierID}:`, emailResult);

        results.push({
          supplierID,
          supplierQuotationID,
          success: true,
          message: `Supplier Quotation (ID: ${supplierQuotationID}) processed and email sent to ${supplier.SupplierEmail}`,
        });
      } catch (error) {
        console.error(`Error processing SupplierID=${supplierID}, SupplierQuotationID=${supplierQuotationID}:`, error.message, error.stack);
        results.push({
          supplierID,
          supplierQuotationID,
          success: false,
          message: `Failed for supplier ${supplierID}: ${error.message}`,
        });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(`Error sending RFQ for PurchaseRFQID=${purchaseRFQID}:`, error.message, error.stack);
    return res.status(500).json({ success: false, message: `Failed to send RFQ: ${error.message}` });
  }
}

module.exports = { sendRFQToSuppliers };