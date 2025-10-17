'use client';
import React from 'react';

type ProductSkeletonProps = {
  count?: number;
  className?: string;
};

export default function ProductSkeleton({
  count = 6,
  className = '',
}: ProductSkeletonProps) {
  return (
    <div
      className={`mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='h-24 rounded-lg bg-[var(--color-bg)] animate-pulse border border-[color:var(--color-accent)]/20'
        />
      ))}
    </div>
  );
}
