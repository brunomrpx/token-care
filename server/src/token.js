class Token {
  constructor(id, createDate = new Date()) {
    this.id = id;
    this.createDate = createDate;
    this.finishDate = null;
    this.selectedDate = null;
    this.waitingTime = null;
  }

  finish() {
    this.finishDate = new Date();
  }

  select() {
    this.selectedDate = new Date();
    this.waitingTime = this.selectedDate.getTime() - this.createDate.getTime();
  }
}

module.exports = Token;
