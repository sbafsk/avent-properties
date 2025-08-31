'use client'

import dynamic from 'next/dynamic'
import { MainLayout } from '@/components/main-layout'

// Dynamically import the test component with SSR disabled
const TestMigrationContent = dynamic(
  () => import('./test-migration-content'),
  { 
    ssr: false,
    loading: () => (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <p className="text-luxury text-muted-foreground">Loading migration test...</p>
        </div>
      </div>
    )
  }
)

export default function TestMigrationPage() {
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="heading-luxury text-4xl text-foreground mb-8">
            Migration Test Page
          </h1>
          
          <TestMigrationContent />
        </div>
      </div>
    </MainLayout>
  )
}
