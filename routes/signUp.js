const Account = require("../modules/Account.js");
const { accounts } = require("../modules/managers.js");

const { createHash } = require("../modules/hash.js");

module.exports = async function createAccount(req, res) {
  const redirect = req.query.redirect;
  
  const username = typeof req.body.username === "string" ? req.body.username : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const confirmPassword = typeof req.body.confirmPassword === "string" ? req.body.confirmPassword : "";

  const errors = [];

  if (req.loggedIn) errors.push("You are already logged in");
  else {
    if (username.length < 2 || username.length > 20) errors.push("Username must be 2-20 characters");
    if (!/^[A-Za-z0-9_]*$/.test(username)) errors.push("Username must contain only letters, numbers, and underscores");
    if (await accounts.getAccountByUsername(username)) errors.push("That username is already taken");
    else {
      if (password.length < 5) errors.push("Password must be at least 5 characters");
      if (password !== confirmPassword) errors.push("Passwords do not match");
    }
  }
  
  if (errors.length >= 1)
    res.render("signUp", { errors, username, redirect: redirect ? encodeURIComponent(redirect) : redirect });
  else {
    const account = Account.fromJson({
      id: await accounts.getNextId(),
      username: req.body.username,
      hashedPassword: await createHash(password),
      createdAt: Date.now()
    });

    await accounts.saveAccount(account);

    req.session.account = account.id;
    res.redirect(redirect ? redirect : "/");
  }
}