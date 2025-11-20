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
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip component provides contextual definitions for financial terms
 * Supports both hover (desktop) and tap (mobile) interactions
 * Intelligently positions itself to avoid viewport edges
 */
export default function Tooltip({
  term,
  definition,
  children,
  position = 'top',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Hover detection with 200ms delay (desktop)
  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsVisible(false);
  };

  // Tap detection for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  // Close tooltip when tapping outside (mobile)
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
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

  // Intelligent positioning logic to avoid viewport edges
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 8; // Minimum distance from viewport edge

    let newPosition = position;

    // Check if tooltip would overflow viewport and adjust position
    if (position === 'top' && tooltipRect.top < padding) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && tooltipRect.bottom > viewportHeight - padding) {
      newPosition = 'top';
    } else if (position === 'left' && tooltipRect.left < padding) {
      newPosition = 'right';
    } else if (position === 'right' && tooltipRect.right > viewportWidth - padding) {
      newPosition = 'left';
    }

    // Additional check for horizontal overflow on top/bottom positions
    if ((newPosition === 'top' || newPosition === 'bottom')) {
      if (tooltipRect.left < padding) {
        // Tooltip overflows left edge - adjust by adding left offset
        tooltip.style.left = `${padding - tooltipRect.left}px`;
      } else if (tooltipRect.right > viewportWidth - padding) {
        // Tooltip overflows right edge - adjust by adding right offset
        tooltip.style.left = `${viewportWidth - padding - tooltipRect.right}px`;
      }
    }

    setActualPosition(newPosition);
  }, [isVisible, position]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Position classes based on actual position
  const getPositionClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  // Arrow position classes
  const getArrowClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-800 dark:border-t-neutral-700';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-800 dark:border-b-neutral-700';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-800 dark:border-l-neutral-700';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-800 dark:border-r-neutral-700';
    }
  };

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
          className={`
            absolute z-50 w-64 px-3 py-2 
            bg-neutral-800 dark:bg-neutral-700 
            text-white text-sm leading-relaxed rounded-lg shadow-lg
            transition-opacity duration-200 ease-in-out
            ${getPositionClasses()}
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Tooltip content */}
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-neutral-200 dark:text-neutral-300">{definition}</div>
          
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
