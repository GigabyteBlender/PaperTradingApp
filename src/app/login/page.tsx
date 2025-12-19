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

  // Clear error when user starts typing
  const handleInputChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    if (error) {
      setError('');
    }
  };

  /**
   * Handle form submission
   * Validates credentials and authenticates user
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

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
      // AuthContext will handle redirect automatically
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="w-full max-w-md mx-auto">

        <div className="rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sign in to your account to continue
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-lg text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}


            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange(setEmail, e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors"
                placeholder="you@example.com"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Password input field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors"
                placeholder="••••••••"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Link to signup page */}
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
