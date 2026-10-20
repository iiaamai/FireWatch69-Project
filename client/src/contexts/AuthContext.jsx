/* eslint-disable react-refresh/only-export-components */
import { AuthProvider as ExistingAuthProvider } from '../context/AuthContext.jsx';
import { useAuth as useExistingAuth } from '../hooks/useAuth.js';

export function AuthProvider({ children }) {
  return <ExistingAuthProvider>{children}</ExistingAuthProvider>;
}

export function useAuth() {
  const auth = useExistingAuth();
  return {
    ...auth,
    signIn: auth.login,
    signOut: auth.logout,
  };
}
