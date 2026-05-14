'use client';

import { Card } from './Card';

interface SkeletonProps {
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

export function Skeleton({
  count = 1,
  height = 'h-4',
  width = 'w-full',
  className = '',
}: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${width} ${height} bg-surface-2 rounded animate-pulse ${className}`}
        />
      ))}
    </>
  );
}

export function ToolSkeleton() {
  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 space-y-4">
        <Skeleton height="h-6" width="w-32" />
        <div className="space-y-3">
          <Skeleton height="h-10" />
          <Skeleton height="h-10" />
          <Skeleton height="h-24" />
        </div>
      </Card>

      {/* Options Section */}
      <Card className="p-6 space-y-4">
        <Skeleton height="h-6" width="w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} height="h-10" />
          ))}
        </div>
      </Card>

      {/* Output Section */}
      <Card className="p-6 space-y-4">
        <Skeleton height="h-6" width="w-32" />
        <Skeleton height="h-32" />
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Skeleton height="h-10" className="flex-1" />
        <Skeleton height="h-10" className="flex-1" />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, idx) => (
        <Card key={idx} className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton height="h-10 w-10" className="rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton height="h-4" width="w-24" />
              <Skeleton height="h-3" width="w-20" />
            </div>
          </div>
          <Skeleton height="h-3" count={2} />
          <div className="flex gap-2">
            <Skeleton height="h-6 w-12" className="rounded-full" />
            <Skeleton height="h-6 w-12" className="rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
