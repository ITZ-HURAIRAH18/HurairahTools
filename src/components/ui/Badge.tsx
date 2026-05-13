import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'green' | 'amber' | 'blue' | 'red';
}

export function Badge({ className, variant = 'green', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'bg-[#EAF5EC] text-[#1A6B3A]': variant === 'green',
          'bg-[#FEF3C7] text-[#D97706]': variant === 'amber',
          'bg-[#E8F1FB] text-[#2563EB]': variant === 'blue',
          'bg-[#FDE8E8] text-[#DC2626]': variant === 'red',
        },
        className
      )}
      {...props}
    />
  );
}
