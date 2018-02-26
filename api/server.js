const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// TODO: use MongoDB
const queue = [];
let count = 0;

router.get('/queue', (ctx, next) => {
  const showAll = Boolean(ctx.request.query.showAll);
  let filteredQueue = queue;

  if (!showAll) {
    filteredQueue = queue.filter(token => token.active);
  }

  ctx.body = filteredQueue;
});

router.post('/queue/token', (ctx, next) => {
  const token = {
    id: ++count,
    date: new Date(),
    active: true
  };

  queue.push(token);

  ctx.body = token;
});

router.post('/queue/actions', (ctx, next) => {
  const action = ctx.request.body.action;

  switch (action) {
    case 'next':
      const firstToken = queue.find(token => token.active);

      firstToken.active = false;
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
  const tokenIndex = queue.findIndex(token => token.id === id);

  if (tokenIndex === -1) {
    ctx.status = 404;
    ctx.body = 'Token not found';
    return;
  }

  const [token] = queue.splice(tokenIndex, 1);

  ctx.body = token;
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

