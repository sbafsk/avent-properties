"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from './loading-spinner'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`bg-white/10 flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-lg">📷</span>
          </div>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/5"
          >
            <LoadingSpinner size="sm" text="" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoading ? 0 : 1, 
          scale: isLoading ? 1.05 : 1 
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          className="object-cover transition-transform duration-300 hover:scale-105"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      </motion.div>
    </div>
  )
}

export function PropertyImage({
  src,
  alt,
  className,
  priority = false
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
      priority={priority}
    />
  )
}
