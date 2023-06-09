const mongoose = require("mongoose");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Otp = require("../model/otp");
const logger = require("../config/logger");

exports.signup = async (user) => {
  const result = await user.save();
  return result._id;
};

exports.login = async (email, inputPassword) => {
  logger.info("In Auth login  ");
  const user = await User.findOne({ email, isActive: true }).select(
    "+password"
  );
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  logger.info("token " + token);

  await User.findOneAndUpdate({ _id: user._id }, { token: token });

  return token;
};

exports.logout = async (id) => {
  logger.info("In Auth logout ");
  const user = await User.findOne({ _id: id });
  user.token = null;
  await User.findOneAndUpdate({ _id: user._id }, { token: "" });
};

exports.verifyToken = async (token) => {
  logger.info("In Auth verifyToken ");
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(payload);
  const user = await User.findOne({ _id: payload._id, isActive: true });
  if (!user) {
    throw new Error("User not found or deactivated");
  } else if (!user.token || user.token != token) {
    throw new Error("Access Denied. please login");
  }
  return user;
};

exports.saveOtpToDB = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  await otp.save();
  logger.info("OTP saved successfully to DB");
};

exports.changePassword = async (user, oldPassword, newPassword) => {
  // Compare the old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new Error("Invalid old password");
  }
  // Update the user's password
  user.password = newPassword;
  await user.save();
  return user;
};

exports.verifyOtpByEmail = async (email, otp) => {
  const otpHolder = await Otp.findOne({ email });
  if (!otpHolder) {
    throw new Error("OTP not found");
  }
  const isOtpValid = await bcrypt.compare(otp, otpHolder.otp);
  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }
  const user = await User.updateOne(
    { email: email },
    { emailVerified: true, isActive: true }
  );
  await Otp.deleteOne({ email: email });
  return user;
};

exports.resetPassword = async (id, password) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.updateOne(
    { _id: id },
    { password: encryptedPassword },
    { new: true }
  );
  return newUser;
};
// exports.resetPassword = async (email,otp,password)=>{
//     let otpHolder = await Otp.findOne({ email: email });
//     let user = await User.findOne({ email: email });

//     if (!otpHolder) throw new Error("The link has been expired !");

//     const isOtpValid = await bcrypt.compare(otp, otpHolder.otp);
//     if (!isOtpValid) throw new Error("The link is Invalid !");

//     await Otp.deleteOne({ email: email });
//     user.password = password;
//     await user.save();
//     return user;
// }

exports.forgotPassword = async (email) => {
  let user = await User.findOne({ email: email });
  if (!user) throw new Error("User not found with this email !");

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );
  return [user._id, token];
};
