import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'indigo' | 'amber' | 'green' | 'red';
}

export function Badge({ className, variant = 'indigo', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'bg-accent/10 text-accent': variant === 'indigo',
          'bg-amber/10 text-amber': variant === 'amber',
          'bg-success/10 text-success': variant === 'green',
          'bg-danger/10 text-danger': variant === 'red',
        },
        className
      )}
      {...props}
    />
  );
}
