"use client"

import { PropertySkeleton } from '@/components/ui/property-skeleton'

export default function ListingsLoading() {
  return (
    <div className="flex gap-8">
      {/* Filter Sidebar Placeholder */}
      <div className="hidden lg:block w-80">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="space-y-4">
            <div className="h-6 bg-white/10 rounded animate-pulse w-3/4" />
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <PropertySkeleton count={6} />
      </div>
    </div>
  )
}
