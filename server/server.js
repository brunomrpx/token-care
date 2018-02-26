const SocketIO = require('socket.io');
const Http = require('http');
const QueueService = require('./src/queue-service');

const server = Http.createServer();
const io = SocketIO(server);
const queueService = new QueueService();

const emitUpdateQueue = (socket = io) => socket.emit('queue-updated', queueService.getQueue());

io.on('connection', socket => {
  console.log('-> connected');

  emitUpdateQueue(socket);

  socket.on('disconnect', () => console.log('-> disconnected'));

  socket.on('create-token', () => {
    const token = queueService.createToken();

    socket.emit('token-created', token);
    emitUpdateQueue();
  });

  socket.on('revoke-token', token => {
    const deleted = queueService.deleteToken(token.id);

    socket.emit('token-revoked', deleted);
    emitUpdateQueue();
  });
});

io.on('next-token', () => {
  queueService.next();
  emitUpdateQueue();
});

server.listen(3000);
console.log('-> Server listening on port 3000');
