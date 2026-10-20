import { getClientEnv } from '../config/env.js';
import { mockLoginResponse, mockMeResponse } from '../mocks/authFixtures.js';

const STORAGE_KEY = 'fw69_access_token';

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function login(email, password) {
  const { useMock, apiUrl } = getClientEnv();

  if (useMock) {
    await delay(400);
    const body = mockLoginResponse(email, password);
    setStoredToken(body.data.accessToken);
    return body.data;
  }

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || 'Login failed');
  }
  setStoredToken(body.data.accessToken);
  return body.data;
}

export async function fetchMe() {
  const { useMock, apiUrl } = getClientEnv();
  const token = getStoredToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  if (useMock) {
    await delay(200);
    return mockMeResponse().data.user;
  }

  const res = await fetchWithTimeout(`${apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) {
    setStoredToken(null);
    throw new Error(body.message || 'Session expired');
  }
  return body.data.user;
}

export function logout() {
  setStoredToken(null);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const FETCH_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Request timed out. Check that the API is running.');
      timeoutError.cause = err;
      throw timeoutError;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
