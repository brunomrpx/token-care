const Token = require('./token');

class QueueService {
  constructor(counter = 0, queue = []) {
    this.counter = counter;
    this.queue = queue;
  }

  createToken() {
    const token = new Token(++this.counter);
    this.queue.push(token);

    return token;
  }

  getQueue(showAll = true) {
    let queue = this.queue;

    if (showAll) {
      queue = queue.filter(token => token.active);
    }

    return queue;
  }

  next() {
    const firstToken = this.queue.find(token => token.active);

    firstToken.active = false;

    return firstToken;
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
