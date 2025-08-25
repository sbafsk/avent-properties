"use client"

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

interface FirstInputDelayEntry extends PerformanceEntry {
  processingStart: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  })

  useEffect(() => {
    // Only run in browser and if PerformanceObserver is available
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcp = entries[0] as PerformanceEntry
      setMetrics(prev => ({ ...prev, fcp: fcp.startTime }))
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcp = entries[entries.length - 1] as PerformanceEntry
      setMetrics(prev => ({ ...prev, lcp: lcp.startTime }))
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fid = entries[0] as FirstInputDelayEntry
      setMetrics(prev => ({ ...prev, fid: fid.processingStart - fid.startTime }))
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }))
    }

    // Cleanup
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  // Log metrics to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.values(metrics).some(m => m !== null)) {
      console.log('🚀 Performance Metrics:', metrics)
    }
  }, [metrics])

  return null // This component doesn't render anything
}

export function PerformanceDebugger() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMetrics = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        setMetrics({
          fcp: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          lcp: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          fid: 0, // Would need more complex tracking
          cls: 0, // Would need more complex tracking
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart
        })
      }
    }

    updateMetrics()
    window.addEventListener('load', updateMetrics)
    return () => window.removeEventListener('load', updateMetrics)
  }, [])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-gold text-gold-foreground p-2 rounded-full shadow-lg"
        title="Performance Debugger"
      >
        🚀
      </button>
      
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-black/90 backdrop-blur-sm p-4 rounded-lg text-white text-sm max-w-xs">
          <h3 className="font-semibold mb-2">Performance Metrics</h3>
          <div className="space-y-1">
            <div>FCP: {metrics.fcp?.toFixed(2)}ms</div>
            <div>LCP: {metrics.lcp?.toFixed(2)}ms</div>
            <div>TTFB: {metrics.ttfb?.toFixed(2)}ms</div>
          </div>
        </div>
      )}
    </>
  )
}
