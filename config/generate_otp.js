const otpGenerator = require("otp-generator");
const logger = require('./logger');
exports.generateOtp = () => {
    const OTP = otpGenerator.generate(6, {
      number: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    logger.info(OTP);
    return OTP;
};