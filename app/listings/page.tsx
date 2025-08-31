'use client'

import dynamic from 'next/dynamic'
import { MainLayout } from '@/components/main-layout'

// Dynamically import the component with SSR disabled to avoid build issues
const ListingsWithFilters = dynamic(
  () => import('@/components/listings-with-filters').then(mod => ({ default: mod.ListingsWithFilters })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex gap-8">
        <div className="w-64 h-96 bg-white/10 backdrop-blur-sm rounded-lg animate-pulse" />
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }
)

export default function ListingsPage() {
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="heading-luxury text-4xl md:text-5xl text-foreground mb-4">
              Luxury Properties
            </h1>
            <p className="text-luxury text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover exceptional coastal properties in Uruguay&apos;s most prestigious locations
            </p>
          </div>
          
          {/* Listings with Filters - Now uses Supabase GraphQL hooks */}
          <ListingsWithFilters />
        </div>
      </div>
    </MainLayout>
  )
}
