/**
 * Common form validation utilities to eliminate duplicate validation logic.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!email.includes('@')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
}

export function validatePassword(password: string, minLength: number = 8): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters long` };
  }
  return { isValid: true };
}

export function validateUsername(username: string, minLength: number = 3): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  if (username.length < minLength) {
    return { isValid: false, error: `Username must be at least ${minLength} characters long` };
  }
  return { isValid: true };
}

export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
}
