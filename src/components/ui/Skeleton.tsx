'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  const classes = cn(
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
    {
      'rounded-full': variant === 'circular',
      'rounded-md': variant === 'rectangular',
      'rounded': variant === 'text',
    },
    className
  );

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return <div className={classes} style={style} />;
};

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <Skeleton className="w-80 h-80 aspect-square" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" height={16} width="80%" />
      <Skeleton variant="text" height={14} width="60%" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" height={20} width="40%" />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4">
    <div className="flex flex-col items-center gap-3">
      <Skeleton variant="circular" width={64} height={64} />
      <Skeleton variant="text" height={14} width="70%" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-5 space-y-3">
      <Skeleton variant="text" height={18} width="90%" />
      <Skeleton variant="text" height={14} width="100%" />
      <Skeleton variant="text" height={14} width="70%" />
      <div className="pt-2">
        <Skeleton variant="text" height={14} width="40%" />
      </div>
    </div>
  </div>
);

export const HeroCarouselSkeleton = () => (
  <section className="w-full py-4 sm:py-8 overflow-hidden bg-gray-50">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
      <div className="relative h-[300px] sm:h-[500px] lg:h-[550px] w-full max-w-full mx-auto mt-2 sm:mt-4 flex items-center justify-center">
        <Skeleton className="w-[88%] md:w-[82%] h-full rounded-2xl" />
      </div>
      <div className="flex justify-center gap-3 mt-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3 rounded-full ${i === 0 ? 'w-10 bg-slate-900' : 'w-3 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Skeleton;
