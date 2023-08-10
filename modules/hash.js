const bcrypt = require("bcrypt");

const saltRounds = Number(process.env.SALT_ROUNDS) ?? 10;

module.exports.createHash = async function(plaintext) {
  return await bcrypt.hash(plaintext, saltRounds);
}

module.exports.compareHash = async function(compareTo, hash) {
  return await bcrypt.compare(compareTo, hash);
}