const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

const sendEmail = async (to, subject, message) => {
  try {
    const auth = {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
    };

    const transporter = nodemailer.createTransport(mailgunTransport(auth));

    const mailOptions = {
      from: 'noreply@eyenet.com',
      to: to,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
