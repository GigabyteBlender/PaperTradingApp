import { createContext, useContext, Context } from 'react';

/**
 * Factory function to create a context hook with automatic error handling.
 * Eliminates duplicate hook patterns across contexts.
 */
export function createContextHook<T>(
  context: Context<T | undefined>,
  contextName: string
) {
  return function useContextHook(): T {
    const ctx = useContext(context);
    if (ctx === undefined) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }
    return ctx;
  };
}
