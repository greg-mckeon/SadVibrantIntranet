module.exports = class Account {
  constructor(id, username, admin, hashedPassword, createdAt) {
    this.id = id;
    this.username = username;
    this.admin = admin ?? false;
    this.hashedPassword = hashedPassword;
    this.createdAt = createdAt;
  }

  toJson() {
    return {
      id: this.id,
      username: this.username,
      admin: this.admin,
      hashedPassword: this.hashedPassword,
      createdAt: this.createdAt
    };
  }

  static fromJson(json) {
    return new Account(json.id, json.username, json.admin, json.hashedPassword, json.createdAt);
  }
}