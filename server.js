const { createServer } = require('http');
const next = require('next');
const { initializeRealtime } = require('./src/lib/realtime');
const getConfig = require('next/config').default;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { serverRuntimeConfig } = getConfig();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = initializeRealtime(server);

  server.listen(serverRuntimeConfig.socketPort, () => {
    console.log(`> Ready on http://localhost:${serverRuntimeConfig.socketPort}`);
  });

  io.on('connection', (socket) => {
    console.log('Real-time connection established:', socket.id);
  });
});