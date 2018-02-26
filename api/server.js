const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const QueueService = require('./src/queue-service');

const app = new Koa();
const router = new Router();

const queueService = new QueueService();

router.get('/queue', (ctx, next) => {
  const showAll = Boolean(ctx.request.query.showAll);
  const filteredQueue = queueService.getQueue(showAll);

  ctx.body = filteredQueue;
});

router.post('/queue/token', (ctx, next) => {
  const token = queueService.createToken();

  ctx.body = token;
});

router.post('/queue/actions', (ctx, next) => {
  const action = ctx.request.body.action;

  switch (action) {
    case 'next':
      const firstToken = queueService.next();
      ctx.body = firstToken;
      break
    default:
      ctx.body = 'Invalid action';
      ctx.status = 404;
      break
  }
});

router.delete('/queue/token/:id', (ctx, next) => {
  const id = parseInt(ctx.params.id, 10);

  try {
    token = queueService.deleteToken(id);
    ctx.body = token;
  } catch (error) {
    ctx.status = 400; // TODO: handle each error correctly
    ctx.body = error.message;
  }
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

