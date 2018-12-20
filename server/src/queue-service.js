const Token = require('./token');

class QueueService {
  constructor(counter = 0, queue = [], finished = [], selected = []) {
    this.counter = counter;
    this.queue = queue;
    this.finished = finished;
    this.selected = selected;
  }

  createToken() {
    const token = new Token(++this.counter);
    this.queue.push(token);

    return token;
  }

  getStructure() {
    const { queue, finished, selected } = this;

    return { queue, finished, selected};
  }

  finish(tokenId) {
    const tokenIndex = this.selected.findIndex(token => token.id === tokenId);
    const token = this.selected[tokenIndex];

    token.finish();

    this.selected.splice(tokenIndex, 1);
    this.finished.push(token);

    return token;
  }

  next() {
    const nextToken = this.queue.shift() || null;

    if (nextToken) {
      this.selected.push(nextToken);
    }

    return nextToken;
  }

  revokeToken(id) {
    return this.removeTokenFrom(this.queue, id);
  }

  deleteToken(id) {
    return this.removeTokenFrom(this.finished, id);
  }

  removeTokenFrom(list, id) {
    const tokenIndex = list.findIndex(token => token.id === id);

    if (tokenIndex === -1) {
      throw new Error(`Token with id ${id} not found`);
    }

    const [token] = list.splice(tokenIndex, 1);

    return token;
  }
}

module.exports = QueueService;
