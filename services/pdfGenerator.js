const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

function generateRFQHtml(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels) {
  const mergedParcels = parcels.map(p => {
    const matchingQuotation = quotationParcels.find(qp => qp.ItemID === p.ItemID);
    return {
      ...p,
      Rate: matchingQuotation ? matchingQuotation.Rate : '',
      Amount: matchingQuotation ? matchingQuotation.Amount : '',
      CountryOfOrigin: matchingQuotation ? matchingQuotation.CountryOfOriginID : '',
    };
  });

  const sanitizedData = {
    series: sanitizeHtml(rfqDetails.Series || 'N/A'),
    requiredByDate: sanitizeHtml(rfqDetails.RequiredByDate || 'N/A'),
    supplierQuoteSeries: sanitizeHtml(quotationDetails?.Series || 'N/A'),
    companyName: sanitizeHtml(rfqDetails.CompanyName || 'N/A'),
    supplierName: sanitizeHtml(supplierDetails?.SupplierName || 'N/A'),
    supplierAddress: sanitizeHtml(`${supplierDetails.AddressTitle || ''}\n${supplierDetails.City || ''}\nBotswana`),
    companyAddress: sanitizeHtml(`${rfqDetails.CompanyName || ''}\n${rfqDetails.City || ''}\nBotswana`),
    terms: sanitizeHtml(rfqDetails.Terms || 'N/A'),
  };

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          p { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Purchase RFQ</h1>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <table>
          <tr><td><strong>Purchase RFQ Series:</strong> ${sanitizedData.series}</td></tr>
          <tr><td><strong>Supplier Quote Series:</strong> ${sanitizedData.supplierQuoteSeries}</td></tr>
        </table>
        <table>
          <tr><td><strong>To Supplier:</strong> ${sanitizedData.supplierName}</td></tr>
          <tr><td><strong>Required By Date:</strong> ${sanitizedData.requiredByDate}</td></tr>
        </table>
        <table>
          <tr><td><strong>From Company:</strong> ${sanitizedData.companyName}</td></tr>
        </table>
        <table>
          <tr>
            <td><strong>Supplier Address:</strong><br>${sanitizedData.supplierAddress}</td>
            <td><strong>Company Address:</strong><br>${sanitizedData.companyAddress}</td>
          </tr>
        </table>
        <p><strong>Terms:</strong><br>${sanitizedData.terms}</p>
        <h2>Items</h2>
        <table>
          <tr>
            <th>Item Name</th><th>Quantity</th><th>UOM</th><th>Country of Origin</th><th>Rate</th><th>Amount</th>
          </tr>
          ${mergedParcels
            .map(
              parcel => `
                <tr>
                  <td>${sanitizeHtml(parcel.ItemName || 'N/A')}</td>
                  <td>${sanitizeHtml(parcel.ItemQuantity?.toString() || 'N/A')}</td>
                  <td>${sanitizeHtml(parcel.UOMName || 'N/A')}</td>
                  <td>${sanitizeHtml(parcel.CountryOfOrigin || '')}</td>
                  <td>${sanitizeHtml(parcel.Rate?.toString() || '')}</td>
                  <td>${sanitizeHtml(parcel.Amount?.toString() || '')}</td>
                </tr>
              `
            )
            .join('')}
        </table>
        <p>Please review and submit your quotation at your earliest convenience.</p>
        <p><strong>Contact:</strong> Fleet Monkey Team | Email: support@fleetmonkey.com</p>
      </body>
    </html>
  `;
  return htmlContent;
}

async function generateRFQPDF(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels, outputPath) {
  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const htmlContent = generateRFQHtml(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels);

    console.log('Starting Puppeteer with bundled Chromium');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Puppeteer started');

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' },
      printBackground: true,
    });

    await browser.close();
    console.log(`PDF created at: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error creating PDF: ${error.message}`);
    throw new Error(`Error creating PDF: ${error.message}`);
  }
}

module.exports = { generateRFQPDF };