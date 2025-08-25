import { MainLayout } from "@/components/main-layout"

export default function TestDashboardPage() {
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard Test</h1>
          <p className="text-white">If you can see this, the dashboard layout is working.</p>
          
          <div className="mt-8 p-6 bg-white/10 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Test Data</h2>
            <p className="text-white">This is a test to see if the dashboard components load properly.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
