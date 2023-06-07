const otpGenerator = require("otp-generator");

exports.generateOtp = () => {
    const OTP = otpGenerator.generate(6, {
      number: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(OTP);
    return OTP;
};