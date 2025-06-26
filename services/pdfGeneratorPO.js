const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

// Helper function to generate HTML content for Purchase Order
function generatePOHtml(poDetails, parcels) {
  // Sanitize inputs to prevent XSS
  const sanitizedData = {
    series: sanitizeHtml(poDetails.Series || 'N/A'),
    requiredByDate: sanitizeHtml(poDetails.RequiredByDate || 'N/A'),
    companyName: sanitizeHtml(poDetails.CompanyName || 'N/A'),
    supplierName: sanitizeHtml(poDetails.SupplierName || 'N/A'),
    supplierAddress: sanitizeHtml(`${poDetails.SupplierName || ''}\n${poDetails.City || ''}\nBotswana`),
    companyAddress: sanitizeHtml(`${poDetails.CompanyName || ''}\n${poDetails.City || ''}\nBotswana`),
    terms: sanitizeHtml(poDetails.Terms || 'N/A'),
  };

  // HTML template with enhanced CSS matching pdfGenerator.js
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Purchase Order</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #4CAF50;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }
        .details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .details div {
          width: 48%;
        }
        .details p {
          margin: 5px 0;
          font-size: 14px;
        }
        .details p strong {
          color: #4CAF50;
        }
        .address-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .address-section div {
          width: 48%;
          font-size: 12px;
        }
        .address-section p {
          margin: 5px 0;
        }
        .address-section strong {
          font-style: italic;
          color: #666;
        }
        .terms-section {
          margin-bottom: 20px;
        }
        .terms-section strong {
          display: block;
          font-size: 14px;
          color: #4CAF50;
          margin-bottom: 5px;
        }
        .terms-section p {
          margin: 0;
          font-size: 12px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        .items-table th {
          background-color: #4CAF50;
          color: white;
        }
        .items-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 20px;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer .contact {
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Purchase Order</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="details">
          <div>
            <p><strong>Purchase Order Series:</strong> ${sanitizedData.series}</p>
            <p><strong>To Supplier:</strong> ${sanitizedData.supplierName}</p>
          </div>
          <div>
            <p><strong>Required By Date:</strong> ${sanitizedData.requiredByDate}</p>
            <p><strong>From Company:</strong> ${sanitizedData.companyName}</p>
          </div>
        </div>

        <div class="address-section">
          <div>
            <p><strong>Supplier Address:</strong></p>
            <p>${sanitizedData.supplierAddress}</p>
          </div>
          <div>
            <p><strong>Company Address:</strong></p>
            <p>${sanitizedData.companyAddress}</p>
          </div>
        </div>

        <div class="terms-section">
          <strong>Terms:</strong>
          <p>${sanitizedData.terms}</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${parcels
              .map(
                parcel => `
                  <tr>
                    <td>${sanitizeHtml(parcel.ItemName || 'N/A')}</td>
                    <td>${sanitizeHtml(parcel.ItemQuantity?.toString() || 'N/A')}</td>
                    <td>${sanitizeHtml(parcel.UOMName || 'N/A')}</td>
                    <td>${sanitizeHtml(parcel.Rate?.toString() || 'N/A')}</td>
                    <td>${sanitizeHtml(parcel.Amount?.toString() || 'N/A')}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Please review and confirm receipt of this purchase order.</p>
          <p class="contact">Contact: Fleet Monkey Team | Email: support@fleetmonkey.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
}

async function generatePurchaseOrderPDF(poDetails, parcels, outputPath) {
  try {
    // Ensure the output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Generate HTML content for Purchase Order
    const htmlContent = generatePOHtml(poDetails, parcels);

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
    throw new Error(`Failed to generate Purchase Order PDF: ${error.message}`);
  }
}

module.exports = { generatePurchaseOrderPDF };