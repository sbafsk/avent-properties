import type { ReactNode } from "react"
import { DashboardNavbar } from "./dashboard-navbar"
import { SmoothTransition } from "./ui/route-transition"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="flex-1 pt-24">
        <SmoothTransition>
          {children}
        </SmoothTransition>
      </main>
    </div>
  )
}
