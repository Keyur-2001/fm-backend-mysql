const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

// Helper function to generate HTML content
function generatePDFHtml(type, rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels) {
  // Determine document type (RFQ or Sales Quotation)
  const isRFQ = type === 'RFQ';
  const title = isRFQ ? 'Purchase RFQ' : 'Sales Quotation';
  const recipientLabel = isRFQ ? 'To Supplier' : 'To Customer';
  const recipientName = isRFQ ? supplierDetails.SupplierName : quotationDetails.CustomerName;
  const recipientAddress = isRFQ
    ? `${supplierDetails.AddressTitle || ''}\n${supplierDetails.City || ''}\nBotswana`
    : `${quotationDetails.CustomerName || ''}\n${quotationDetails.City || ''}\nBotswana`;
  const seriesLabel = isRFQ ? 'Purchase RFQ Series' : 'Sales Quotation Series';
  const seriesValue = isRFQ ? rfqDetails.Series : quotationDetails.Series;
  const footerText = isRFQ
    ? 'Please review and submit your quotation at your earliest convenience.'
    : 'Please review and confirm acceptance of this sales quotation.';

  // Merge parcels for RFQ (if applicable)
  const mergedParcels = isRFQ
    ? parcels.map(p => {
        const matchingQuotation = quotationParcels.find(qp => qp.ItemID === p.ItemID);
        return {
          ...p,
          Rate: matchingQuotation ? matchingQuotation.Rate : '',
          Amount: matchingQuotation ? matchingQuotation.Amount : '',
          CountryOfOrigin: matchingQuotation ? matchingQuotation.CountryOfOriginID : '',
        };
      })
    : parcels;

  // Sanitize inputs to prevent XSS
  const sanitizedData = {
    series: sanitizeHtml(seriesValue || 'N/A'),
    requiredByDate: sanitizeHtml((isRFQ ? rfqDetails.RequiredByDate : quotationDetails.RequiredByDate) || 'N/A'),
    companyName: sanitizeHtml((isRFQ ? rfqDetails.CompanyName : quotationDetails.CompanyName) || 'N/A'),
    recipientName: sanitizeHtml(recipientName || 'N/A'),
    recipientAddress: sanitizeHtml(recipientAddress),
    companyAddress: sanitizeHtml(`${(isRFQ ? rfqDetails.CompanyName : quotationDetails.CompanyName) || ''}\n${(isRFQ ? rfqDetails.City : quotationDetails.City) || ''}\nBotswana`),
    terms: sanitizeHtml((isRFQ ? rfqDetails.Terms : quotationDetails.Terms) || 'N/A'),
  };

  // HTML template with enhanced CSS
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Roboto', sans-serif;
          margin: 40px;
          color: #2d3748;
          background-color: #f7fafc;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px;
          background: linear-gradient(90deg, #2b6cb0, #3182ce);
          color: #fff;
          border-radius: 8px 8px 0 0;
          margin: -30px -30px 20px;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        .header .date {
          font-size: 12px;
          opacity: 0.9;
        }
        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-section .field {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .info-section .label {
          font-weight: 700;
          width: 130px;
          color: #2b6cb0;
        }
        .info-section .value {
          flex: 1;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          background: #edf2f7;
        }
        .address-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .address-section .address-box {
          min-width: 200px;
        }
        .address-section .label {
          font-weight: 700;
          color: #2b6cb0;
          margin-bottom: 5px;
        }
        .address-section .address {
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          background: #edf2f7;
          min-height: 80px;
          white-space: pre-line;
        }
        .terms-section {
          text-align: center;
          margin-bottom: 30px;
        }
        .terms-section .label {
          font-weight: 700;
          color: #2b6cb0;
          margin-bottom: 5px;
        }
        .terms-section .terms {
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          background: #edf2f7;
          width: 200px;
          margin: 0 auto;
        }
        .items-section h2 {
          font-size: 18px;
          font-weight: 700;
          color: #2b6cb0;
          text-decoration: underline;
          margin-bottom: 15px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th, .items-table td {
          border: 1px solid #e2e8f0;
          padding: 10px;
          text-align: left;
        }
        .items-table th {
          background: #2b6cb0;
          color: #fff;
          font-weight: 700;
        }
        .items-table tr:nth-child(even) {
          background: #f7fafc;
        }
        .items-table tr:hover {
          background: #e2e8f0;
        }
        .footer {
          text-align: center;
          font-size: 11px;
          color: #718096;
          font-style: italic;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
        }
        .footer span {
          color: #2b6cb0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          <div class="date">Date: ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="info-section">
          <div>
            <div class="field">
              <span class="label">${seriesLabel}:</span>
              <span class="value">${sanitizedData.series}</span>
            </div>
            <div class="field">
              <span class="label">${recipientLabel}:</span>
              <span class="value">${sanitizedData.recipientName}</span>
            </div>
          </div>
          <div>
            <div class="field">
              <span class="label">Required By Date:</span>
              <span class="value">${sanitizedData.requiredByDate}</span>
            </div>
            <div class="field">
              <span class="label">From Company:</span>
              <span class="value">${sanitizedData.companyName}</span>
            </div>
          </div>
        </div>
        <div class="address-section">
          <div class="address-box">
            <div class="label">${recipientLabel} Address:</div>
            <div class="address">${sanitizedData.recipientAddress}</div>
          </div>
          <div class="address-box">
            <div class="label">Company Address:</div>
            <div class="address">${sanitizedData.companyAddress}</div>
          </div>
        </div>
        <div class="terms-section">
          <div class="label">Terms:</div>
          <div class="terms">${sanitizedData.terms}</div>
        </div>
        <div class="items-section">
          <h2>Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: ${isRFQ ? '25' : '30'}%;">Item Name</th>
                <th style="width: 15%;">Quantity</th>
                <th style="width: 15%;">UOM</th>
                ${isRFQ ? '<th style="width: 20%;">Country of Origin</th>' : ''}
                <th style="width: ${isRFQ ? '15' : '20'}%;">Rate</th>
                <th style="width: ${isRFQ ? '15' : '20'}%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${mergedParcels
                .map(
                  parcel => `
                    <tr>
                      <td>${sanitizeHtml(parcel.ItemName || 'N/A')}</td>
                      <td>${sanitizeHtml(parcel.ItemQuantity?.toString() || 'N/A')}</td>
                      <td>${sanitizeHtml(parcel.UOMName || 'N/A')}</td>
                      ${isRFQ ? `<td>${sanitizeHtml(parcel.CountryOfOrigin || '')}</td>` : ''}
                      <td>${sanitizeHtml(parcel.Rate?.toString() || 'N/A')}</td>
                      <td>${sanitizeHtml(parcel.Amount?.toString() || 'N/A')}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </div>
        <div class="footer">
          ${footerText}<br>
          <span>Contact: Fleet Monkey Team | Email: support@fleetmonkey.com</span>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
}

async function generateRFQPDF(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels, outputPath) {
  try {
    // Ensure the output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Generate HTML content for RFQ
    const htmlContent = generatePDFHtml('RFQ', rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' },
      printBackground: true,
    });

    // Close browser
    await browser.close();

    return outputPath;
  } catch (error) {
    throw new Error(`Failed to generate RFQ PDF: ${error.message}`);
  }
}

async function generateSalesQuotationPDF(quotationDetails, parcels, outputPath) {
  try {
    // Ensure the output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Generate HTML content for Sales Quotation
    const htmlContent = generatePDFHtml('SalesQuotation', null, parcels, null, quotationDetails, []);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' },
      printBackground: true,
    });

    // Close browser
    await browser.close();

    return outputPath;
  } catch (error) {
    throw new Error(`Failed to generate Sales Quotation PDF: ${error.message}`);
  }
}

module.exports = { generateRFQPDF, generateSalesQuotationPDF };