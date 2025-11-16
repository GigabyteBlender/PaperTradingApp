'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as authAPI from '@/lib/api/auth';
import { tokenStorage } from '@/lib/api/client';
import type { UserResponse, SignupRequest, LoginRequest } from '@/lib/types';
import { createContextHook } from '@/hooks/useContext';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/market'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  /**
   * Validate session and load user on mount.
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch {
        tokenStorage.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handle route protection and redirects based on auth state.
   */
  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname?.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname?.startsWith(route));

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
      router.push('/login');
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  /**
   * Login user with email and password.
   */
  const login = async (credentials: LoginRequest) => {
    const response = await authAPI.login(credentials);
    setUser(response.user);
  };

  /**
   * Register new user account.
   */
  const signup = async (data: SignupRequest) => {
    const response = await authAPI.signup(data);
    setUser(response.user);
  };

  /**
   * Logout user and redirect to login page.
   */
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    router.push('/login');
  };

  /**
   * Refresh user data from server.
   */
  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch {
      tokenStorage.clearTokens();
      setUser(null);
      router.push('/login');
    }
  };

  /**
   * Check if user is authenticated for protected pages.
   * Returns true if authenticated, false otherwise.
   * Shows loading state while checking authentication.
   */
  const requireAuth = () => {
    return isAuthenticated && !isLoading;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        refreshUser,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * Must be used within AuthProvider.
 */
export const useAuth = createContextHook(AuthContext, 'Auth');
