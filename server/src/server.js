import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { getEnv } from './config/env.js';
import { connectDb } from './config/db.js';
import { initSockets } from './sockets/index.js';

const { port, nodeEnv } = getEnv();

async function start() {
  try {
    await connectDb();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  const httpServer = createServer(app);
  const io = new Server(httpServer);
  initSockets(io);

  httpServer.listen(port, () => {
    console.log(`Server listening on port ${port} (${nodeEnv})`);
  });
}

start();
