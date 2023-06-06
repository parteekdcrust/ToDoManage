const mongoose = require("mongoose");
const User = require("../model/user");
const Otp = require("../model/otp");
const authService = require("../services/auth_service");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
require('dotenv').config();

const generateOtp = () => {
  const OTP = otpGenerator.generate(6, {
    number: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log(OTP);
  return OTP;
};

const sendOtpToEmail = async (email, OTP) => {
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
    html: `<b>This is your OTP: ${OTP} for verification.The OTP will expires in 5 mins </b>`, // html body
  });
  return;
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // console.log(req.body);
    const user = new User({ name, email, password, role });
    const _id = await authService.signup(user);

    const OTP = generateOtp(); //generating otp
    await sendOtpToEmail(email, OTP); //sending otp to email

    const otp = new Otp({ email: email, otp: OTP }); //making new record in otp collection
    await authService.saveOtpToDB(otp);

    res.status(201).json({
      id: _id,
      message: "OTP sent Successfully on your registered email. Please Verify",
    });
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password: inputPassword } = req.body;

    const token = await authService.login(email, inputPassword);

    res.status(200).send({ token: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    let loggedInUser = req.loggedInUser;

    await authService.logout(loggedInUser._id);
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      throw new Error({ message: "Access Denied. Please send Token" });

    const token = authHeader.split(" ")[1];
    if (!token)
      throw new Error({ message: "Access Denied. Please send Token" });
    console.log("token " + token);

    const user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
  } catch (error) {
    console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.verifyOtpByEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpHolder = await Otp.findOne({ email });
    if (!otpHolder) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpHolder.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.updateOne({ email: email }, { emailVerified: true });
    await Otp.deleteOne({ email: email });

    return res.status(200).json({
      message: "Email verified Succesfully",
    });
  } catch (error) {
    console.log("Error in verifying OTP ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let otp = await Otp.findOne({ email: email });
    let user = await User.findOne({ email: email });

    if (!otp) throw new Error("The link has been expired !");

    const isOtpValid = await bcrypt.compare(req.query.otp, otp.otp);
    if (!isOtpValid) throw new Error("The link is Invalid !");

    await Otp.deleteOne({ email: email });
    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      message: "Password has been reset !",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const OTP = generateOtp();

    let user = await User.findOne({ email: email });
    if (!user) throw new Error("User not found with this email !");

    const otp = new Otp({ email: email, otp: OTP }); //making new record in otp collection
    await authService.saveOtpToDB(otp);

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
      subject: "Reset Link for password", // Subject line
      html: `<p>This is your link for reset password: <a href="http://localhost:3000/api/auth/reset-password?otp=${OTP}">Reset you password</a></p>`, // html body
    });

    res.status(200).json({
      message:
        "Link has been sent to email. Please open the link and reset the password",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;

  try {
    const user = await authService.changePassword(
      token,
      oldPassword,
      newPassword
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
