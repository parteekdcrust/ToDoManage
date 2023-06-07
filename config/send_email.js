const nodemailer = require("nodemailer");


exports.sendOtpToEmail = async (email, html) => {
    const transporter = nodemailer.createTransport({
      // connect with the smtp
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });
  
    await transporter.sendMail({
      from: `"Message from TodoManager" <process.env.AUTH_EMAIL>`, // sender address
      to: email, // list of receivers
      subject: "OTP Verifictaion", // Subject line
      html: html // html body
    });
    return;
  };

//  const html =  `<b>This is your OTP: ${OTP} for verification.The OTP will expires in 5 mins </b>`