const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

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

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Make HTTP request to API with automatic token attachment and error handling.
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { skipAuth = false, headers = {}, ...restConfig } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    // Attach JWT token to Authorization header for authenticated requests
    if (!skipAuth) {
      const token = tokenStorage.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJSON = contentType?.includes('application/json');

      if (!response.ok) {
        if (isJSON) {
          const errorData = await response.json();
          
          // Handle 401 Unauthorized - token expired or invalid
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

      if (isJSON) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new APIError(
        0,
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  /**
   * Make GET request.
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * Make POST request with JSON body.
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make PUT request with JSON body.
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make DELETE request.
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new APIClient(API_BASE_URL);
