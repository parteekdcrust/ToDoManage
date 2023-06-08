const express =require('express');
const router = express.Router();

const {signup,login,verifyOtpByEmail,verifyToken,logout,forgotPassword,getResetPassword,changePassword, postResetPassword} = require('../controller/auth_controller');
router.route('/signup').post(signup);
router.route('/email-otp-verification').post(verifyOtpByEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:id/:token').get(getResetPassword);
router.route('/reset-password/:id/:token').post(postResetPassword);
router.route('/change-password').post(verifyToken,changePassword);

router.route('/login').post(login);
router.route('/logout').post(verifyToken,logout);
module.exports = router;