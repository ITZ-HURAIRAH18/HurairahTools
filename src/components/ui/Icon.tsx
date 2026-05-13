import { icons } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const LucideIcon = (icons as any)[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon className={cn('h-4 w-4', className)} />;
}
