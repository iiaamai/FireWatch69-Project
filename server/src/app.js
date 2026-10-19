import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getEnv } from './config/env.js';

const { webOrigin, isTest } = getEnv();

const app = express();

app.use(cors({ origin: webOrigin.length > 0 ? webOrigin : true }));
app.use(express.json());

if (!isTest) {
  app.use(morgan('dev'));
}

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
