import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redis } from './redis';

export const initializeRealtime = (server: any) => {
  const io = new Server(server, {
    cors: { origin: '*' },
    maxHttpBufferSize: 1e6,
    pingTimeout: 30000,
  });

  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  // subscribe to surge updates published in surgeEngine and broadcast them
  const listener = redis.duplicate();
  listener.subscribe('surge-updates');
  listener.on('message', (_channel, message) => {
    const payload = JSON.parse(message);
    io.to(`zone:${payload.zoneId}`).emit('surge:update', payload);
  });

  io.on('connection', (socket) => {
    socket.on('subscribe:zone', (zoneId: string) => socket.join(`zone:${zoneId}`));

    socket.on('disconnect', () => {
      // Cleanup on disconnect
    });
  });

  return io;
};

export const getIO = () => {
  // This would need to be implemented with proper singleton pattern
  // For now, returning null as we initialize in server.js
  return null;
};