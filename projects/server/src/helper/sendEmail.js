const nodemailer = require("nodemailer");
require('dotenv').config()

module.exports = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    console.log(error);
  }
};