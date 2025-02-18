

"use strict";

const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_SMTP_USER,
      pass: process.env.MAIL_SMTP_PASS,
    },
  });


  async function sendMail(to,subject,html) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.MAIL_SMTP_FROM, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line 
      html: html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    
  };

  module.exports = {sendMail};