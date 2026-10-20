import { useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';
import { getClientEnv } from '../config/env.js';
import { AuthContext } from './authContext.js';

const SESSION_CHECK_TIMEOUT_MS = 12_000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(authService.getStoredToken()));
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = authService.getStoredToken();
    if (!token) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      authService.logout();
      setUser(null);
      setError('Session check timed out. Please sign in again.');
      setLoading(false);
    }, SESSION_CHECK_TIMEOUT_MS);

    authService
      .fetchMe()
      .then((me) => {
        if (!cancelled) {
          setError(null);
          setUser(me);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setUser(null);
          authService.logout();
          setError(err.message);
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated: Boolean(user),
      useMock: getClientEnv().useMock,
    }),
    [user, loading, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
