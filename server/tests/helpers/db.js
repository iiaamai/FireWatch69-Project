import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export async function connectTestDb() {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

export async function clearTestDb() {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
}

export async function closeTestDb() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}
