import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B3A] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[#1A6B3A] text-white hover:bg-[#2D8A50]': variant === 'primary',
            'hover:bg-[#EBF5EC] hover:text-[#0A2415] text-[#4A6B55]': variant === 'ghost',
            'border border-[#D0E8D4] bg-white hover:bg-[#F0F7F1] text-[#1A6B3A]': variant === 'outline',
            'bg-[#DC2626] text-white hover:bg-[#B91C1C]': variant === 'danger',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2 text-sm': size === 'md',
            'h-12 px-8 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
