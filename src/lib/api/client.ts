const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// error schema that is consistent with the backend
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Token storage utilities for managing JWT tokens in localStorage.
 */
export const tokenStorage = {
  /**
   * Get access token from localStorage.
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  
  /**
   * Save access token to localStorage.
   */
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  /**
   * Get refresh token from localStorage.
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Save refresh token to localStorage.
   */
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  
  /**
   * Clear all tokens from localStorage.
   */
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};


// Extends fetch's RequestInit to add custom skipAuth flag
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Core method that handles all HTTP requests.
   * Automatically adds auth tokens, handles errors, and parses responses.
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    // Extract custom skipAuth flag and separate it from standard fetch options
    const { skipAuth = false, headers = {}, ...restConfig } = config;

    // Build headers object starting with JSON content type
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    // Add JWT token to Authorization header unless skipAuth is true
    if (!skipAuth) {
      const token = tokenStorage.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      // Make the fetch call with all config options (method, body, etc.) and headers
      const response = await fetch(url, {
        ...restConfig, // Contains method, body, and other fetch options
        headers: requestHeaders,
      });

      const contentType = response.headers.get('content-type');
      const isJSON = contentType?.includes('application/json');

      // Handle error responses (status codes 400-599)
      if (!response.ok) {
        if (isJSON) {
          const errorData = await response.json();
          
          // On 401, clear tokens and redirect to login
          if (response.status === 401) {
            tokenStorage.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }

          throw new APIError(
            response.status,
            errorData.error_code || 'UNKNOWN_ERROR',
            errorData.detail || 'An error occurred'
          );
        } else {
          throw new APIError(
            response.status,
            'UNKNOWN_ERROR',
            `HTTP ${response.status}: ${response.statusText}`
          );
        }
      }

      // Parse and return successful JSON responses
      if (isJSON) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      // Re-throw APIErrors as-is
      if (error instanceof APIError) {
        throw error;
      }

      // Wrap network errors in APIError format
      throw new APIError(
        0,
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  /**
   * GET request wrapper.
   * Usage: apiClient.get<User>('/api/users/me')
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request wrapper. Converts data object to JSON string in body.
   * Usage: apiClient.post('/api/auth/login', { email, password }, { skipAuth: true })
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined, // Converts { email, password } to JSON string
    });
  }
}

export const apiClient = new APIClient();
