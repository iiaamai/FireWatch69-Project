export function getClientEnv() {
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
  return { useMock, apiUrl };
}
