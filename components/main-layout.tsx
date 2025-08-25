import type { ReactNode } from "react"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { SmoothTransition } from "./ui/route-transition"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <SmoothTransition>
          {children}
        </SmoothTransition>
      </main>
      <Footer />
    </div>
  )
}
