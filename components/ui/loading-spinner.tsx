"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  text = "Loading..." 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Outer ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-white/20",
          "animate-pulse"
        )} />
        
        {/* Spinning ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-transparent",
          "border-t-gold border-r-gold/50",
          "animate-spin"
        )} />
        
        {/* Inner glow */}
        <div className={cn(
          "absolute inset-1 rounded-full",
          "bg-gradient-to-br from-gold/20 to-transparent",
          "animate-pulse"
        )} />
      </div>
      
      {text && (
        <p className="text-luxury text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export function LoadingDots({ 
  size = "md",
  className 
}: Omit<LoadingSpinnerProps, 'text'>) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3", 
    xl: "w-4 h-4"
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-gold rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

export function LoadingSkeleton({ 
  className,
  lines = 3 
}: { 
  className?: string
  lines?: number 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-white/10 rounded",
            "animate-pulse",
            i === 0 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}
