export function getEnv() {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProd = nodeEnv === 'production';
  const port = Number(process.env.PORT);

  const jwtAccessSecret =
    process.env.JWT_ACCESS_SECRET || (isProd ? undefined : 'dev-access-secret-change-me');

  if (!jwtAccessSecret) {
    throw new Error('JWT_ACCESS_SECRET is required when NODE_ENV=production');
  }

  const webOrigin = (process.env.WEB_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    nodeEnv,
    isProd,
    isTest: nodeEnv === 'test',
    port: Number.isFinite(port) && port > 0 ? port : 3000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/firewatch69',
    jwtAccessSecret,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    webOrigin,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}
