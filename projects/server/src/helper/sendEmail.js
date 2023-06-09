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
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: subject,
      html: message,
    });
    console.log("Email is sent successfully");
  } catch (error) {
    console.log("Email is not sent");
    console.log(error);
  }
};