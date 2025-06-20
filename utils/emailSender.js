const nodemailer = require('nodemailer');
const fs = require('fs').promises;

async function sendRFQEmail(toEmail, rfqSeries, pdfPath) {
  try {
    // Log configuration for debugging
    console.log('SMTP Configuration:', {
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_PORT: '587',
      SMTP_USER: 'keyur.it2001@gmail.com',
      SMTP_PASS: '[REDACTED]',
    });

    // Check if PDF file exists
    await fs.access(pdfPath, fs.constants.F_OK);
    console.log(`PDF file verified: ${pdfPath}`);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'keyur.it2001@gmail.com',
        pass: 'vtbgmipgoyaatiqq',
      },
      service: 'gmail',
    });

    const mailOptions = {
      from: `"Fleet Monkey" <keyur.it2001@gmail.com>`,
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