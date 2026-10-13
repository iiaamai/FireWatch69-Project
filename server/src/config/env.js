export function getEnv() {
  const port = Number(process.env.PORT);

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number.isFinite(port) && port > 0 ? port : 3000,
  };
}
