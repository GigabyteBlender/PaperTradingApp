import { ReactNode } from 'react';

interface AuthFormWrapperProps {
  children: ReactNode;
}

/**
 * Reusable wrapper for auth forms to eliminate duplicate page structure.
 */
export default function AuthFormWrapper({ children }: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      {children}
    </div>
  );
}
