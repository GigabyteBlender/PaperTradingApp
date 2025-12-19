'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { APIError } from '@/lib/api/client';
import { validateEmail, validateUsername, validatePassword, validatePasswordMatch } from '@/utils/formValidation';

/**
 * Signup page component
 * Handles new user registration with email, username, and password
 */
export default function SignupPage() {
  // Form state management
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Auth context and navigation
  const { signup } = useAuth();
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
   * Validates all fields and creates new user account
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

    // Validate username (min 3 characters)
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      setError(usernameValidation.error!);
      return;
    }

    // Validate password strength (min 8 characters)
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      return;
    }

    // Ensure passwords match
    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      setError(passwordMatchValidation.error!);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new user account via API
      await signup({ email, username, password });
      // AuthContext will handle redirect automatically
    } catch (err) {
      // Handle API errors (e.g., email already exists)
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
              Create Account
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Get started with your trading journey
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

            {/* Username input field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => handleInputChange(setUsername, e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors"
                placeholder="johndoe"
                disabled={isSubmitting}
                required
                minLength={3}
              />
            </div>


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
                minLength={8}
              />
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">Must be at least 8 characters</p>
            </div>

            {/* Confirm password input field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-neutral-900 dark:text-white">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange(setConfirmPassword, e.target.value)}
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
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Link to login page */}
          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
