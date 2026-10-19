import mongoose from 'mongoose';
import { getEnv } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDb(uri) {
  const { mongoUri } = getEnv();
  const target = uri || mongoUri;
  await mongoose.connect(target);
  return mongoose.connection;
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
