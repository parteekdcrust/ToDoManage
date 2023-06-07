const mongoose = require("mongoose");
const User = require("../model/user");
const Otp = require("../model/otp");
const authService = require("../services/auth_service");
const { generateOtp } = require("../config/generate_otp");
const { sendOtpToEmail } = require("../config/send_email");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    const _id = await authService.signup(user);

    const OTP = generateOtp(); //generating otp
    const html = `<b>This is your OTP: ${OTP} for verification.The OTP will expires in 5 mins </b>`;
    await sendOtpToEmail(email, html); //sending otp to email

    const otp = new Otp({ email: email, otp: OTP }); //making new record in otp collection
    await authService.saveOtpToDB(otp);

    res.status(201).json({
      id: _id,
      message:
        "User signed-up and OTP sent Successfully on your registered email. Please Verify",
    });
  } catch (error) {
    console.log(error);
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
    let user = req.loggedInUser;

    await authService.logout(user._id);
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
    const result = await authService.verifyOtpByEmail(email, otp);
    return res.status(200).json({
      message: "Email verified Succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = req.query.otp;
    const result = await authService.resetPassword(email, otp);
    res.status(200).json({
      message: "Password Reset Successfully",
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
    const otp = new Otp({ email: email, otp: OTP }); //making new record in otp collection
    await authService.saveOtpToDB(otp);
    const result = await authService.forgotPassword(email);
    
    const html = `<p>This is your link for reset password: <a href="http://to-do-manage.onrender.com/api/auth/reset-password?otp=${OTP}">Reset you password</a></p>` // html body
    await sendOtpToEmail(email, html); //sending link to email

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
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.loggedInUser;
    const result = await authService.changePassword(
      user,
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

exports.authorize = (roles) => {
  return (req, res, next) => {
    const user = req.loggedInUser;
    if (roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({
        message: "User not Authorized !",
      });
    }
  };
};
