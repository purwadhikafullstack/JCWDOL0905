const db = require("../models");
const users = db.User;

async function checkReferralCodeUniqueness(referralCode) {
  const existingUser = await users.findOne({where: {referral_code: referralCode}});
  return existingUser ? false : true;
}

function generateRandomReferralCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

module.exports = {
  checkReferralCodeUniqueness,
  generateRandomReferralCode,
};
