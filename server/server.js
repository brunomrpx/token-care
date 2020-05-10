const SocketIO = require('socket.io');
const Http = require('http');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./token-care-firebase-adminsdk.json');
const QueueService = require('./src/queue-service');

const server = Http.createServer();
const io = SocketIO(server);
const queueService = new QueueService();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://token-care.firebaseio.com"
});

const sendPushNotification = async deviceId => {
  const notificationOptions = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  const notificationMessage = {
    notification: {
      title: "Finally, it's your turn!",
      body: "Your token has been called by an attendant.",
    }
  };

  await firebaseAdmin
    .messaging()
    .sendToDevice(deviceId, notificationMessage, notificationOptions);
};

io.on('connection', async socket => {
  console.log('-> connected');

  io.emit('queue-updated', await queueService.getStructure());

  socket.on('disconnect', () => console.log('-> disconnected'));

  socket.on('create-token', async deviceId => {
    socket.emit('token-created', await queueService.createToken(deviceId));
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
      // send push notification just for tokens associated with a deviceId,
      // debug tokens aren't generated from a real device
      if (nextToken.deviceId) {
        sendPushNotification(nextToken.deviceId);
      }
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
