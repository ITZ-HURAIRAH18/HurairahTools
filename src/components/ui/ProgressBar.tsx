import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number; // 0 to 100
  label?: string;
}

export function ProgressBar({ progress, label, className, ...props }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)} {...props}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-text">{label}</span>
          <span className="text-text-muted">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full bg-[linear-gradient(135deg,var(--accent),var(--violet))] shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
