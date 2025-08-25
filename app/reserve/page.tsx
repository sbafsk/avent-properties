import { MainLayout } from "@/components/main-layout"
import { ReservationForm } from "@/components/reservation-form"
import { SectionHeader } from "@/components/section-header"

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
