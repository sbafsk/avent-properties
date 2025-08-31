'use client'

import dynamic from 'next/dynamic'
import { MainLayout } from "@/components/main-layout"
import { SectionHeader } from "@/components/section-header"

// Dynamically import the reservation form with SSR disabled
const ReservationForm = dynamic(
  () => import('@/components/reservation-form').then(mod => ({ default: mod.ReservationForm })),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-6"></div>
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    )
  }
)

export default function ReservePage() {
  return (
    <MainLayout>
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Reserve Your Tour"
            subtitle="Experience luxury property viewing with our premium tour packages. From complimentary tours to first-class travel experiences."
            centered
            className="mb-12"
          />

          <ReservationForm />
        </div>
      </div>
    </MainLayout>
  )
}
