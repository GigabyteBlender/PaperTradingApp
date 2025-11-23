'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

/**
 * Props for the Tooltip component
 * @property term - The financial term being explained
 * @property definition - The definition text to display in the tooltip
 * @property children - The element(s) that trigger the tooltip (typically a label or text)
 * @property position - Preferred position of the tooltip relative to the trigger element
 */
interface TooltipProps {
  term: string;
  definition: string;
  children: ReactNode;
}

export default function Tooltip({
  term,
  definition,
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Show tooltip after 200ms hover delay to prevent accidental triggers
  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsVisible(true), 200);
  };

  // Hide tooltip and cancel pending hover timeout
  const handleMouseLeave = () => {
    hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current);
    setIsVisible(false);
  };

  // Toggle tooltip visibility on mobile tap
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  // Dismiss tooltip when clicking outside on mobile
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (tooltipRef.current && triggerRef.current && 
          !tooltipRef.current.contains(target) && !triggerRef.current.contains(target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  // Clear hover timeout on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* Trigger element */}
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        className="cursor-help border-b border-dashed border-neutral-400 dark:border-neutral-500"
        aria-describedby={isVisible ? `tooltip-${term}` : undefined}
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term}`}
          role="tooltip"
          aria-label={`Definition of ${term}`}
          className="absolute z-50 w-64 px-3 py-2 bottom-full left-0 mb-2
            bg-neutral-800 dark:bg-neutral-700 
            text-white text-sm leading-relaxed rounded-lg shadow-lg
            transition-opacity duration-200 ease-in-out opacity-100"
        >
          {/* Tooltip content */}
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-neutral-200 dark:text-neutral-300">{definition}</div>
          
          {/* Arrow */}
          <div
            className="absolute w-0 h-0 border-4 top-full left-4 -mt-1 
              border-l-transparent border-r-transparent border-b-transparent 
              border-t-neutral-800 dark:border-t-neutral-700"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
