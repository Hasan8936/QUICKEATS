const { createServer } = require('http');
const next = require('next');
const { initializeRealtime } = require('./src/lib/realtime');
const getConfig = require('next/config').default;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { serverRuntimeConfig } = getConfig();

app.prepare().then(async() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    try {
        const io = await initializeRealtime(server);

        server.listen(serverRuntimeConfig.socketPort || process.env.SOCKET_PORT || 3001, () => {
            console.log(`> Ready on http://localhost:${serverRuntimeConfig.socketPort || process.env.SOCKET_PORT || 3001}`);
        });

        io.on('connection', (socket) => {
            console.log('Real-time connection established:', socket.id);
        });
    } catch (err) {
        console.error('Failed to initialize realtime server:', err);
        server.listen(serverRuntimeConfig.socketPort || process.env.SOCKET_PORT || 3001, () => {
            console.log(`> HTTP server running on port ${serverRuntimeConfig.socketPort || process.env.SOCKET_PORT || 3001} (realtime disabled)`);
        });
    }
});