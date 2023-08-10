const Database = require("@replit/database");

const AccountManager = require("./AccountManager.js");
const PostManager = require("./PostManager.js");

const db = new Database();

module.exports.accounts = new AccountManager(db);
module.exports.posts = new PostManager(db);