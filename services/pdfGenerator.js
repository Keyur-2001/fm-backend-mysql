const puppeteer = require('puppeteer-core');
const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

// Set cache directory for Windows
PUPPETEER_CACHE_DIR = path.join(__dirname, 'puppeteer_cache');

// Your existing generateRFQHtml function
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
    supplierQuoteSeries: sanitizeHtml(quotationDetails.Series || 'N/A'),
    companyName: sanitizeHtml(rfqDetails.CompanyName || 'N/A'),
    supplierName: sanitizeHtml(supplierDetails.SupplierName || 'N/A'),
    supplierAddress: sanitizeHtml(`${supplierDetails.AddressTitle || ''}\n${supplierDetails.City || ''}\nBotswana`),
    companyAddress: sanitizeHtml(`${rfqDetails.CompanyName || ''}\n${rfqDetails.City || ''}\nBotswana`),
    terms: sanitizeHtml(rfqDetails.Terms || 'N/A'),
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section div { display: inline-block; width: 45%; vertical-align: top; }
        .section div:last-child { text-align: right; }
        .address-section { display: flex; justify-content: space-between; }
        .address-section div { width: 45%; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { margin-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Purchase RFQ</h1>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="section">
        <div>
          <strong>Purchase RFQ Series:</strong> ${sanitizedData.series}
        </div>
        <div>
          <strong>Supplier Quote Series:</strong> ${sanitizedData.supplierQuoteSeries}
        </div>
      </div>
      <div class="section">
        <div>
          <strong>To Supplier:</strong> ${sanitizedData.supplierName}
        </div>
        <div>
          <strong>Required By Date:</strong> ${sanitizedData.requiredByDate}
        </div>
      </div>
      <div class="section">
        <div>
          <strong>From Company:</strong> ${sanitizedData.companyName}
        </div>
      </div>
      <div class="address-section">
        <div>
          <strong>Supplier Address:</strong><br>${sanitizedData.supplierAddress}
        </div>
        <div>
          <strong>Company Address:</strong><br>${sanitizedData.companyAddress}
        </div>
      </div>
      <div class="section">
        <strong>Terms:</strong><br>${sanitizedData.terms}
      </div>
      <div class="section">
        <h3>Items</h3>
        <table>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>UOM</th>
            <th>Country of Origin</th>
            <th>Rate</th>
            <th>Amount</th>
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
      </div>
      <div class="footer">
        <p>Please review and submit your quotation at your earliest convenience.</p>
        <p>Contact: Fleet Monkey Team | Email: support@fleetmonkey.com</p>
      </div>
    </body>
    </html>
  `;
  return htmlContent;
}

async function generateRFQPDF(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels, outputPath) {
  try {
    // Create output directory
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Generate HTML
    const htmlContent = generateRFQHtml(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels);

    // Start Puppeteer
    console.log('Starting Puppeteer with Chromium at C:\\chrome-win\\chrome.exe');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\chrome-win\\chrome.exe', // Use Windows path
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Puppeteer started');

    // Create a new page
    const page = await browser.newPage();

    // Load HTML
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

    console.log(`PDF created at: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error creating PDF: ${error.message}`);
    throw new Error(`Error creating PDF: ${error.message}`);
  }
}

module.exports = { generateRFQPDF };