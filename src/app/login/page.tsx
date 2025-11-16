'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { APIError } from '@/lib/api/client';
import { validateEmail, validatePassword } from '@/utils/formValidation';

/**
 * Login page component
 * Handles user authentication with email and password
 */
export default function LoginPage() {
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Auth context and navigation
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Handle form submission
   * Validates credentials and authenticates user
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      return;
    }

    // Validate password (minimum length of 1 for login)
    const passwordValidation = validatePassword(password, 1);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      return;
    }

    setIsSubmitting(true);

    try {
      // Authenticate user via API
      await login({ email, password });
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      // Handle API errors
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md mx-auto">
        {/* Login card container */}
        <div className="rounded-lg shadow-md p-8" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message display */}
            {error && (
              <div className="border px-4 py-3 rounded" style={{ background: '#7f1d1d', borderColor: '#991b1b', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Email input field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--input)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)',
                  '--tw-ring-color': 'var(--ring)'
                } as React.CSSProperties}
                placeholder="you@example.com"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Password input field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--input)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)',
                  '--tw-ring-color': 'var(--ring)'
                } as React.CSSProperties}
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ 
                background: 'var(--primary)', 
                color: 'var(--primary-foreground)',
                '--tw-ring-color': 'var(--ring)'
              } as React.CSSProperties}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Link to signup page */}
          <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
