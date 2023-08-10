const Account = require("./Account.js");

module.exports = class AccountManager {
  constructor(db) {
    this._accounts = null;
    this._db = db;
  }

  async getAccounts() {
    if (!this._accounts) this._accounts = (await this._db.get("accounts") ?? []).map(acc => Account.fromJson(acc));
    return this._accounts;
  }
  
  async getAccountByUsername(username) {
    return (await this.getAccounts()).find(
      account => account.username.toLowerCase() === username.toLowerCase()
    ) ?? null;
  }
  
  async getAccountById(id) {
    return (await this.getAccounts()).find(
      account => account.id === id
    ) ?? null;
  }

  async saveAccount(account) {
    if (!account instanceof Account) throw new Error("Parameter account must be an instance of Account");
    
    const accounts = await this.getAccounts();
    
    if (!accounts.includes(account)) {
      const index = accounts.findIndex(acc => acc.id === account.id);
      if (index === -1) {
        if (accounts.some(acc => acc.username.toLowerCase() === account.username.toLowerCase()))
          throw new Error(`Another account already exists with the username ${account.username.toLowerCase()}`);
        accounts.push(account);
      }
      else accounts.splice(index, 1, account);
    }

    this._accounts = accounts;
    await this._db.set("accounts", accounts.map(acc => acc.toJson()));
    
    return account;
  }

  async getNextId() {
    const accounts = await this.getAccounts();
    return (accounts[accounts.length-1]?.id ?? 0) + 1;
  }
}