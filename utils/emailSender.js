const nodemailer = require('nodemailer');
const fs = require('fs').promises;
require('dotenv').config();

async function sendRFQEmail(toEmail, rfqSeries, pdfPath) {
  try {
    // Log environment variables for debugging
    console.log('SMTP Configuration:', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS ? '[REDACTED]' : undefined,
    });

    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing required SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)');
    }

    // Check if PDF file exists
    await fs.access(pdfPath, fs.constants.F_OK);
    console.log(`PDF file verified: ${pdfPath}`);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.gmail.com
      port: parseInt(process.env.SMTP_PORT, 10), // 587
      secure: process.env.SMTP_PORT == 465, // false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER, // keyur.it2001@gmail.com
        pass: process.env.SMTP_PASS, // App Password
      },
      service: 'gmail', // Hardcode for Gmail, as per .env
    });

    const mailOptions = {
      from: `"Fleet Monkey" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Purchase RFQ: ${rfqSeries}`,
      text: `Dear Supplier,\n\nPlease find attached the Purchase RFQ (${rfqSeries}) for your review. Kindly submit your quotation at your earliest convenience.\n\nBest regards,\nFleet Monkey Team`,
      attachments: [
        {
          path: pdfPath,
          filename: `RFQ_${rfqSeries}.pdf`,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}: Message ID ${info.messageId}`);
    return { success: true, message: `Email sent to ${toEmail}` };
  } catch (error) {
    console.error(`Error sending email to ${toEmail} for RFQ ${rfqSeries}:`, error.message, error.stack);
    throw new Error(`Error sending email: ${error.message}`);
  }
}

module.exports = { sendRFQEmail };