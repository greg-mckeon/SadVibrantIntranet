const Account = require("../modules/Account.js");
const { accounts } = require("../modules/managers.js");

const { compareHash } = require("../modules/hash.js");

module.exports = async function logIn(req, res) {
  const redirect = req.query.redirect;
  
  const username = typeof req.body.username === "string" ? req.body.username : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  const errors = [];

  const account = await accounts.getAccountByUsername(username);
  
  if (req.loggedIn) errors.push("You are already logged in");
  else {
    if (!account) errors.push("Username does not exist");
    else if (!await compareHash(password, account.hashedPassword)) errors.push("Incorrect password");
  }
    
  if (errors.length >= 1)
    res.render("logIn", { errors, username, redirect: redirect ? encodeURIComponent(redirect) : redirect });
  else {
    req.session.account = account.id;
    res.redirect(redirect ? redirect : "/");
  }
};