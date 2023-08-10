const Account = require("../modules/Account.js");
const { accounts } = require("../modules/managers.js");

const { compareHash } = require("../modules/hash.js");

module.exports = async function logIn(req, res) {
  req.session.destroy();
  res.render("logOut");
};