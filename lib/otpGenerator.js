const speakeasy = require('speakeasy')

function generateSixDigitOTP() {
  const otp = speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    digits: 6,
  })

  return otp
}

module.exports = generateSixDigitOTP
