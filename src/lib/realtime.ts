import { Server } from 'socket.io';

let io: Server | null = null;

export const initializeRealtime = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });
  }

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};