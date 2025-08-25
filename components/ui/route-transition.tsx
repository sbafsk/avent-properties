"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLoading } from "./page-loading"

interface RouteTransitionProps {
  children: React.ReactNode
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingKey, setLoadingKey] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setLoadingKey(prev => prev + 1)
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <PageLoading 
            key={loadingKey}
            message="Loading your luxury experience..."
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export function SmoothTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
