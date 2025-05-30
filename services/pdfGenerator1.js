const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

async function generateRFQPDF(rfqDetails, parcels, supplierDetails, quotationDetails, quotationParcels, outputPath) {
  try {
    // Ensure the output directory exists
    const tempDir = path.dirname(outputPath);
    await fsPromises.mkdir(tempDir, { recursive: true });

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      doc.pipe(stream);

      // Header Section
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text('Purchase RFQ', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      // RFQ Information Section (Two Columns)
      const leftColumnX = 40;
      const rightColumnX = 300;
      const rowHeight = 20;
      let currentY = doc.y;

      doc.fontSize(12).font('Helvetica-Bold');

      // First Row: Purchase RFQ Series & Required By Date
      doc.text('Purchase RFQ Series:', leftColumnX, currentY);
      doc.rect(leftColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(rfqDetails.Series || 'N/A', leftColumnX + 125, currentY);

      doc.font('Helvetica-Bold').text('Required By Date:', rightColumnX, currentY);
      doc.rect(rightColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(rfqDetails.RequiredByDate || 'N/A', rightColumnX + 125, currentY);

      currentY += rowHeight;
      // Second Row: Supplier Quote Series & From Company
      doc.font('Helvetica-Bold').text('Supplier Quote Series:', leftColumnX, currentY);
      doc.rect(leftColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(quotationDetails.Series || 'N/A', leftColumnX + 125, currentY);

      doc.font('Helvetica-Bold').text('From Company:', rightColumnX, currentY);
      doc.rect(rightColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(rfqDetails.CompanyName || 'N/A', rightColumnX + 125, currentY);

      currentY += rowHeight;
      // Third Row: To Supplier
      doc.font('Helvetica-Bold').text('To Supplier:', leftColumnX, currentY);
      doc.rect(leftColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(supplierDetails.SupplierName || 'N/A', leftColumnX + 125, currentY);

      doc.moveDown(2);

      // Address and Terms Section
      currentY = doc.y;
      const addressBoxWidth = 150;
      const addressBoxHeight = 60;

      // Supplier Address (Left)
      doc.font('Helvetica-Bold').text('Supplier Address:', leftColumnX, currentY);
      const supplierAddress = `${supplierDetails.AddressTitle || ''}\n${supplierDetails.City || ''}\nBotswana`;
      doc.rect(leftColumnX + 120, currentY - 5, addressBoxWidth, addressBoxHeight).stroke();
      doc.font('Helvetica').text(supplierAddress, leftColumnX + 125, currentY, { height: addressBoxHeight });

      // Company Address (Right)
      doc.font('Helvetica-Bold').text('Company Address:', rightColumnX, currentY);
      const companyAddress = `${rfqDetails.CompanyName || ''}\n${rfqDetails.City || ''}\nBotswana`;
      doc.rect(rightColumnX + 120, currentY - 5, addressBoxWidth, addressBoxHeight).stroke();
      doc.font('Helvetica').text(companyAddress, rightColumnX + 125, currentY, { height: addressBoxHeight });

      // Centered Terms Section
      const termsBoxWidth = 150;
      const termsBoxHeight = 30;
      const termsX = (doc.page.width - termsBoxWidth) / 2;
      doc.font('Helvetica-Bold').text('Terms:', termsX, currentY + addressBoxHeight + 10, { align: 'center' });
      doc.rect(termsX, currentY + addressBoxHeight + 20, termsBoxWidth, termsBoxHeight).stroke();
      doc.font('Helvetica').text(rfqDetails.Terms || 'N/A', termsX + 5, currentY + addressBoxHeight + 25, {
        width: termsBoxWidth - 10,
        align: 'center'
      });

      doc.moveDown(3);

      // Items Table Section
      doc.font('Helvetica-Bold').fontSize(14).text('Items', { underline: true });
      doc.moveDown(0.5);

      // Table header
      doc.fontSize(10).font('Helvetica-Bold');
      const tableTop = doc.y;
      const tableLeft = 40;
      const colWidths = {
        itemName: 120,
        quantity: 60,
        uom: 60,
        country: 100,
        rate: 60,
        amount: 60,
      };

      // Draw Header Row
      doc.rect(tableLeft, tableTop, colWidths.itemName, 25).fill('#d3d3d3').stroke();
      doc.fillColor('black').text('Item Name', tableLeft + 5, tableTop + 8);

      doc.rect(tableLeft + colWidths.itemName, tableTop, colWidths.quantity, 25).fill('#d3d3d3').stroke();
      doc.text('Quantity', tableLeft + colWidths.itemName + 5, tableTop + 8);

      doc.rect(tableLeft + colWidths.itemName + colWidths.quantity, tableTop, colWidths.uom, 25).fill('#d3d3d3').stroke();
      doc.text('UOM ID', tableLeft + colWidths.itemName + colWidths.quantity + 5, tableTop + 8);

      doc.rect(tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom, tableTop, colWidths.country, 25).fill('#d3d3d3').stroke();
      doc.text('Country of Origin', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + 5, tableTop + 8);

      doc.rect(
        tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country,
        tableTop,
        colWidths.rate,
        25
      ).fill('#d3d3d3').stroke();
      doc.text('Rate', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country + 5, tableTop + 8);

      doc.rect(
        tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country + colWidths.rate,
        tableTop,
        colWidths.amount,
        25
      ).fill('#d3d3d3').stroke();
      doc.text('Amount', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country + colWidths.rate + 5, tableTop + 8);

      // Table Rows
      let currentTableY = tableTop + 25;
      doc.font('Helvetica').fontSize(10);

      const mergedParcels = parcels.map(p => {
        const matchingQuotation = quotationParcels.find(qp => qp.ItemID === p.ItemID);
        return {
          ...p,
          Rate: matchingQuotation ? matchingQuotation.Rate : '',
          Amount: matchingQuotation ? matchingQuotation.Amount : '',
          CountryOfOrigin: matchingQuotation ? matchingQuotation.CountryOfOriginID : '',
        };
      });

      mergedParcels.forEach(parcel => {
        if (currentTableY + 20 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          currentTableY = doc.page.margins.top;
        }

        doc.rect(tableLeft, currentTableY, colWidths.itemName, 20).stroke();
        doc.text(parcel.ItemName || 'N/A', tableLeft + 5, currentTableY + 5, { width: colWidths.itemName - 10 });

        doc.rect(tableLeft + colWidths.itemName, currentTableY, colWidths.quantity, 20).stroke();
        doc.text(parcel.ItemQuantity || 'N/A', tableLeft + colWidths.itemName + 5, currentTableY + 5);

        doc.rect(tableLeft + colWidths.itemName + colWidths.quantity, currentTableY, colWidths.uom, 20).stroke();
        doc.text(parcel.UOMName || 'N/A', tableLeft + colWidths.itemName + colWidths.quantity + 5, currentTableY + 5);

        doc.rect(
          tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom,
          currentTableY,
          colWidths.country,
          20
        ).stroke();
        doc.text(parcel.CountryOfOrigin || '', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + 5, currentTableY + 5);

        doc.rect(
          tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country,
          currentTableY,
          colWidths.rate,
          20
        ).stroke();
        doc.text(parcel.Rate || '', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country + 5, currentTableY + 5);

        doc.rect(
          tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country + colWidths.rate,
          currentTableY,
          colWidths.amount,
          20
        ).stroke();
        doc.text(parcel.Amount || '', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.country + colWidths.rate + 5, currentTableY + 5);

        currentTableY += 20;
      });

      // Footer Section
      doc.moveDown(2);
      doc
        .font('Helvetica-Oblique')
        .fontSize(10)
        .text('Please review and submit your quotation at your earliest convenience.', { align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to generate RFQ PDF: ${error.message}`);
  }
}

async function generateSalesQuotationPDF(quotationDetails, parcels, outputPath) {
  try {
    // Ensure the output directory exists
    const tempDir = path.dirname(outputPath);
    await fsPromises.mkdir(tempDir, { recursive: true });

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      doc.pipe(stream);

      // Header Section
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text('Sales Quotation', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      // Quotation Information Section (Two Columns)
      const leftColumnX = 40;
      const rightColumnX = 300;
      const rowHeight = 20;
      let currentY = doc.y;

      doc.fontSize(12).font('Helvetica-Bold');

      // First Row: Sales Quotation Series
      doc.text('Sales Quotation Series:', leftColumnX, currentY);
      doc.rect(leftColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(quotationDetails.Series || 'N/A', leftColumnX + 125, currentY);

      // From Company
      doc.font('Helvetica-Bold').text('From Company:', rightColumnX, currentY);
      doc.rect(rightColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(quotationDetails.CompanyName || 'N/A', rightColumnX + 125, currentY);

      currentY += rowHeight;
      // Second Row: To Customer
      doc.font('Helvetica-Bold').text('To Customer:', leftColumnX, currentY);
      doc.rect(leftColumnX + 120, currentY - 5, 120, 20).stroke();
      doc.font('Helvetica').text(quotationDetails.CustomerName || 'N/A', leftColumnX + 125, currentY);

      doc.moveDown(2);

      // Address and Terms Section
      currentY = doc.y;
      const addressBoxWidth = 150;
      const addressBoxHeight = 60;

      // Customer Address (Left)
      doc.font('Helvetica-Bold').text('Customer Address:', leftColumnX, currentY);
      const customerAddress = `${quotationDetails.CustomerName || ''}\n${quotationDetails.City || 'N/A'}\nBotswana`;
      doc.rect(leftColumnX + 120, currentY - 5, addressBoxWidth, addressBoxHeight).stroke();
      doc.font('Helvetica').text(customerAddress, leftColumnX + 125, currentY, { height: addressBoxHeight });

      // Company Address (Right)
      doc.font('Helvetica-Bold').text('Company Address:', rightColumnX, currentY);
      const companyAddress = `${quotationDetails.CompanyName || ''}\n${quotationDetails.City || 'N/A'}\nBotswana`;
      doc.rect(rightColumnX + 120, currentY - 5, addressBoxWidth, addressBoxHeight).stroke();
      doc.font('Helvetica').text(companyAddress, rightColumnX + 125, currentY, { height: addressBoxHeight });

      // Centered Terms
      const termsBoxWidth = 150;
      const termsBoxHeight = 30;
      const termsX = (doc.page.width - termsBoxWidth) / 2;
      doc.font('Helvetica-Bold').text('Terms:', termsX, currentY + addressBoxHeight + 10, { align: 'center' });
      doc.rect(termsX, currentY + addressBoxHeight + 20, termsBoxWidth, termsBoxHeight).stroke();
      doc.font('Helvetica').text(quotationDetails.Terms || 'N/A', termsX + 5, currentY + addressBoxHeight + 25, {
        width: termsBoxWidth - 10,
        align: 'center'
      });

      // Items Table
      doc.font('Helvetica-Bold').fontSize(14).text('Items', { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica-Bold');
      const tableTop = doc.y;
      const tableLeft = 40;
      const colWidths = {
        itemName: 195,
        quantity: 60,
        uom: 60,
        rate: 100,
        amount: 100,
      };

      // Draw Header Row
      doc.rect(tableLeft, tableTop, colWidths.itemName, 25).fill('#d3d3d3').stroke();
      doc.fillColor('black').text('Item Name', tableLeft + 5, tableTop + 8);

      doc.rect(tableLeft + colWidths.itemName, tableTop, colWidths.quantity, 25).fill('#d3d3d3').stroke();
      doc.text('Quantity', tableLeft + colWidths.itemName + 5, tableTop + 8);

      doc.rect(tableLeft + colWidths.itemName + colWidths.quantity, tableTop, colWidths.uom, 25).fill('#d3d3d3').stroke();
      doc.text('UOM', tableLeft + colWidths.itemName + colWidths.quantity + 5, tableTop + 8);

      doc.rect(
        tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom,
        tableTop,
        colWidths.rate,
        25
      ).fill('#d3d3d3').stroke();
      doc.text('Rate', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + 5, tableTop + 8);

      doc.rect(
        tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.rate,
        tableTop,
        colWidths.amount,
        25
      ).fill('#d3d3d3').stroke();
      doc.text('Amount', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.rate + 5, tableTop + 8);

      // Table Rows
      let currentTableY = tableTop + 25;
      doc.font('Helvetica').fontSize(10);

      parcels.forEach(parcel => {
        if (currentTableY + 20 > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          currentTableY = doc.page.margins.top;
        }

        doc.rect(tableLeft, currentTableY, colWidths.itemName, 20).stroke();
        doc.text(parcel.ItemName || 'N/A', tableLeft + 5, currentTableY + 5, { width: colWidths.itemName - 10 });

        doc.rect(tableLeft + colWidths.itemName, currentTableY, colWidths.quantity, 20).stroke();
        doc.text(parcel.ItemQuantity || 'N/A', tableLeft + colWidths.itemName + 5, currentTableY + 5);

        doc.rect(tableLeft + colWidths.itemName + colWidths.quantity, currentTableY, colWidths.uom, 20).stroke();
        doc.text(parcel.UOMName || 'N/A', tableLeft + colWidths.itemName + colWidths.quantity + 5, currentTableY + 5);

        doc.rect(
          tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom,
          currentTableY,
          colWidths.rate,
          20
        ).stroke();
        doc.text(parcel.Rate || 'N/A', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + 5, currentTableY + 5);

        doc.rect(
          tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.rate,
          currentTableY,
          colWidths.amount,
          20
        ).stroke();
        doc.text(parcel.Amount || 'N/A', tableLeft + colWidths.itemName + colWidths.quantity + colWidths.uom + colWidths.rate + 5, currentTableY + 5);

        currentTableY += 20;
      });

      // Footer
      doc.moveDown(2);
      doc
        .font('Helvetica-Oblique')
        .fontSize(10)
        .text('Please review and confirm acceptance of this sales quotation.', { align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to generate Sales Quotation PDF: ${error.message}`);
  }
}

module.exports = { generateRFQPDF, generateSalesQuotationPDF };