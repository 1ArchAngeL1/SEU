'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getToken, setToken, removeToken, isAuthenticated } from '@/lib/auth';
import { useRouter, usePathname } from '@/i18n/navigation';

interface AuthContextValue {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setTokenState(getToken());
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked) return;
    const isLoginPage = pathname === '/admin/login';

    if (!token && !isLoginPage) {
      router.replace('/admin/login');
    } else if (token && isLoginPage) {
      router.replace('/admin');
    }
  }, [checked, token, pathname, router]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    router.replace('/admin/login');
  }, [router]);

  if (!checked) return null;

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
