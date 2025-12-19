import { useContext, Context } from 'react';

/**
 * function to create a context hook with automatic error handling.
 * Used to reduce duplicate code across the different contexts.
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
