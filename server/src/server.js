import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { getEnv } from './config/env.js';
import { initSockets } from './sockets/index.js';

const { port, nodeEnv } = getEnv();
const httpServer = createServer(app);
const io = new Server(httpServer);

initSockets(io);

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port} (${nodeEnv})`);
});
