import { apiClient, tokenStorage } from './client';
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
} from '../types';

/**
 * Signup creates a new user account via Supabase Auth and app user record.
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/api/auth/signup',
    data,
    { skipAuth: true }
  );

  // Store tokens after successful signup
  tokenStorage.setToken(response.access_token);
  tokenStorage.setRefreshToken(response.refresh_token);

  return response;
}

/**
 * Login authenticates user via Supabase Auth.
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/api/auth/login',
    data,
    { skipAuth: true }
  );

  // Store tokens after successful login
  tokenStorage.setToken(response.access_token);
  tokenStorage.setRefreshToken(response.refresh_token);

  return response;
}

/**
 * Logout signs out user from Supabase Auth and clears local tokens.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/logout');
  } finally {
    // Clear tokens even if API call fails
    tokenStorage.clearTokens();
  }
}

/**
 * Get current authenticated user info.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return apiClient.get<UserResponse>('/api/auth/me');
}
