interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable loading spinner component to eliminate duplicate loading UI patterns.
 */
export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          {message}
        </p>
      </div>
    </div>
  );
}
