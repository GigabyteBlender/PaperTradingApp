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

  /**
   * Handle form submission
   * Validates all fields and creates new user account
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
      // Redirect to dashboard on success
      router.push('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md mx-auto">
        {/* Signup card container */}
        <div className="rounded-lg shadow-md p-8" style={{ background: 'var(--card)', color: 'var(--card-foreground)' }}>
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
          
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

            {/* Username input field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--input)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)',
                  '--tw-ring-color': 'var(--ring)'
                } as React.CSSProperties}
                placeholder="johndoe"
                disabled={isSubmitting}
                required
                minLength={3}
              />
            </div>

            {/* Password input field with requirements */}
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
                minLength={8}
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>Must be at least 8 characters</p>
            </div>

            {/* Confirm password input field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Link to login page */}
          <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
