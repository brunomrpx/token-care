class Token {
  constructor(id, createDate = new Date()) {
    this.id = id;
    this.createDate = createDate;
    this.finishDate = null;
  }

  finish() {
    this.finishDate = new Date();
  }
}

module.exports = Token;
