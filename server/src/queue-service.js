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

  deleteToken(id) {
    const tokenIndex = this.queue.findIndex(token => token.id === id);

    if (tokenIndex === -1) {
      throw new Error('Token not found');
    }

    const [token] = this.queue.splice(tokenIndex, 1);

    return token;
  }
}

module.exports = QueueService;
