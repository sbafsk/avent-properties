"use client"

import { motion } from "framer-motion"
import { GlassCard } from "../glass-card"

interface PropertySkeletonProps {
  count?: number
  className?: string
}

export function PropertySkeleton({ count = 6, className }: PropertySkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.1
          }}
        >
          <GlassCard className="overflow-hidden">
            {/* Image skeleton */}
            <div className="relative h-48 bg-white/10 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            </div>
            
            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="h-6 bg-white/10 rounded animate-pulse w-3/4" />
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-5/6" />
              </div>
              
              {/* Price and location */}
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gold/20 rounded animate-pulse w-20" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
              </div>
              
              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-white/10 rounded-full animate-pulse w-16"
                  />
                ))}
              </div>
              
              {/* Button */}
              <div className="h-10 bg-gold/20 rounded animate-pulse" />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}

export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <GlassCard className="overflow-hidden">
        {/* Image skeleton */}
        <div className="relative h-64 bg-white/10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </div>
        
        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="h-7 bg-white/10 rounded animate-pulse w-4/5" />
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-4/5" />
          </div>
          
          {/* Price and location */}
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gold/20 rounded animate-pulse w-24" />
            <div className="h-5 bg-white/10 rounded animate-pulse w-28" />
          </div>
          
          {/* Specs */}
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="text-center space-y-1">
                <div className="h-4 bg-white/10 rounded animate-pulse w-8 mx-auto" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-12 mx-auto" />
              </div>
            ))}
          </div>
          
          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 bg-white/10 rounded-full animate-pulse w-20"
              />
            ))}
          </div>
          
          {/* Button */}
          <div className="h-12 bg-gold/20 rounded animate-pulse" />
        </div>
      </GlassCard>
    </motion.div>
  )
}
