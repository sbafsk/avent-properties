"use client"

import { LoadingSpinner } from "./loading-spinner"
import { GlassCard } from "../glass-card"
import { motion } from "framer-motion"

interface PageLoadingProps {
  message?: string
  showBackground?: boolean
}

export function PageLoading({ 
  message = "Loading your luxury experience...",
  showBackground = true 
}: PageLoadingProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center space-y-6"
    >
      <LoadingSpinner size="lg" text={message} />
      
      {/* Decorative elements */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gold/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  )

  if (showBackground) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <GlassCard className="p-12">
          {content}
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {content}
    </div>
  )
}

export function SectionLoading({ 
  message = "Loading content...",
  className 
}: { 
  message?: string
  className?: string 
}) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4"
      >
        <LoadingSpinner size="md" text={message} />
      </motion.div>
    </div>
  )
}

export function InlineLoading({ 
  message,
  size = "sm" 
}: { 
  message?: string
  size?: "sm" | "md" | "lg" 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-3"
    >
      <LoadingSpinner size={size} />
      {message && (
        <span className="text-luxury text-sm text-muted-foreground">
          {message}
        </span>
      )}
    </motion.div>
  )
}
