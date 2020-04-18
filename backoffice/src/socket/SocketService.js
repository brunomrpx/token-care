import io from 'socket.io-client';

const TokenSocketEvents = {
  Create: 'create-token',
  Next: 'next-token',
  Finish: 'finish-token',
  Delete: 'delete-token',
  Updated: 'queue-updated',
  Connect: 'connect'
};

const defaultCallbackEvents = {
  onConnect: () => console.log(':: CONNECTED ::'),
  onUpdateQueue: () => {}
};

export class SocketService {

  constructor(url, callbackEvents) {
    const { onConnect, onUpdateQueue } = { ...defaultCallbackEvents, ...callbackEvents };
    
    this.socket = io.connect(url);
    this.socket.on(TokenSocketEvents.Connect, () => onConnect());
    this.socket.on(TokenSocketEvents.Updated, queue => onUpdateQueue(queue));
  }

  create() {
    this.socket.emit(TokenSocketEvents.Create);
  }

  next() {
    this.socket.emit(TokenSocketEvents.Next);
  }

  finish(token) {
    this.socket.emit(TokenSocketEvents.Finish, token._id);
  }

  delete(token) {
    this.socket.emit(TokenSocketEvents.Delete, token._id);
  }
}
