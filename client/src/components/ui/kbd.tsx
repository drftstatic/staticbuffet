import React from 'react';
import { cn } from '@/lib/utils';

interface KbdProps {
  keys: string[];
  className?: string;
}

export function Kbd({ keys, className }: KbdProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-xs text-gray-500">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}