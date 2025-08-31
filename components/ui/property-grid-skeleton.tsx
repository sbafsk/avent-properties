import React from "react";
import { GlassCard } from "@/components/glass-card";

interface PropertyGridSkeletonProps {
  count?: number;
  className?: string;
}

export function PropertyGridSkeleton({ count = 6, className }: PropertyGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <GlassCard key={index} variant="default" className="overflow-hidden">
          {/* Image skeleton */}
          <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
            </div>
            
            {/* Location skeleton */}
            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
            
            {/* Specs skeleton */}
            <div className="flex gap-4">
              <div className="h-4 bg-white/5 rounded w-12 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-12 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-16 animate-pulse" />
            </div>
            
            {/* Price skeleton */}
            <div className="h-8 bg-white/10 rounded w-24 animate-pulse" />
            
            {/* Button skeleton */}
            <div className="h-10 bg-white/10 rounded animate-pulse" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
