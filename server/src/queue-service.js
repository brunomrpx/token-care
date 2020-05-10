// TODO: move this to a dbconnection file
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/db', { useNewUrlParser: true, useUnifiedTopology: true });

const Token = mongoose.model('Token', {
  createDate: Date,
  finishDate: Date,
  selectedDate: Date,
  waitingTime: Number,
  deleted: Boolean,
  deviceId: String,
});

class QueueService {

  async createToken(deviceId) {
    const token = new Token({
      deviceId,
      createDate: new Date(),
      deleted: false,
    });

    const newToken = await token.save();

    return newToken;
  }

  async getStructure() {
    // this._delete_all();

    const tokens = await Token.find();
    const finished = [];
    const selected = [];
    const queue = [];
    let sumWaitingTime = 0;
    let countWaitingTime = 0

    tokens.forEach(token => {
      if (token.finishDate) {
        sumWaitingTime += token.waitingTime;
        countWaitingTime++;
        return !token.deleted && finished.push(token);
      }
      if (!token.finishDate && token.selectedDate) {
        sumWaitingTime += token.waitingTime;
        countWaitingTime++;
        return selected.push(token);
      }
      queue.push(token);
    });

    const averageWaitingTime = sumWaitingTime / countWaitingTime;
    return { queue, finished, selected, averageWaitingTime };
  }

  async finish(tokenId) {
    const token = await Token.findOne({ _id: tokenId });
    token.finishDate = new Date();

    return await token.save();
  }

  async next() {
    const query = { finishDate: { $exists: false }, selectedDate: { $exists: false } };
    const nextToken = await Token.findOne(query).sort('-created_at').exec();

    if (nextToken) {
      nextToken.selectedDate = new Date();
      nextToken.waitingTime = nextToken.selectedDate.getTime() - nextToken.createDate.getTime();
      await nextToken.save();
    }

    return nextToken;
  }

  async revokeToken(id) {
    // TODO: review this
    const token = await Token.findById(id);
    token.delete();
    return token;
  }

  async deleteToken(id) {
    const token = await Token.findById(id);
    token.deleted = true;
    await token.save();
  }

  // --- debug helpers
  async _delete_all() {
    const tokens = await Token.find();
    tokens.forEach(token => token.delete());
  }
}

module.exports = QueueService;
