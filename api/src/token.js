class Token {
  constructor(id, active = true, date = new Date()) {
    this.id = id;
    this.active = active;
    this.date = date;
  }
}

module.exports = Token;
