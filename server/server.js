const SocketIO = require('socket.io');
const Http = require('http');
const QueueService = require('./src/queue-service');

const server = Http.createServer();
const io = SocketIO(server);
const queueService = new QueueService();

io.on('connection', async socket => {
  console.log('-> connected');

  io.emit('queue-updated', await queueService.getStructure());

  socket.on('disconnect', () => console.log('-> disconnected'));

  socket.on('create-token', async () => {
    socket.emit('token-created', await queueService.createToken());
    io.emit('queue-updated', await queueService.getStructure());
  });

  socket.on('revoke-token', async tokenId => {
    socket.emit('token-revoked', await queueService.revokeToken(tokenId));
    io.emit('queue-updated', await queueService.getStructure());
  });

  socket.on('finish-token', async tokenId => {
    await queueService.finish(tokenId);
    io.emit('queue-updated', await queueService.getStructure());
  });

  socket.on('next-token', async () => {
    const nextToken = await queueService.next();

    if (nextToken) {
      socket.emit('token-received', nextToken);
    }

    io.emit('queue-updated', await queueService.getStructure());
  });

  socket.on('delete-token', async tokenId => {
    await queueService.deleteToken(tokenId);
    io.emit('queue-updated', await queueService.getStructure());
  });
});

server.listen(3000);
console.log('-> Server listening on port 3000');
