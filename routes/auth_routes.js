const express =require('express');
const router = express.Router();

const {signup,login,verifyOtpByEmail,verifyToken,logout,forgotPassword,resetPassword,changePassword} = require('../controller/auth_controller');
router.route('/signup').post(signup);
router.route('/email-otp-verification').post(verifyOtpByEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').get(resetPassword);
router.route('/change-password').post(verifyToken,changePassword);

router.route('/login').post(login);
router.route('/logout').post(verifyToken,logout);
module.exports = router;