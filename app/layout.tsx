import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { PerformanceMonitor } from "@/components/ui/performance-monitor"
import { FavoritesProvider } from "@/hooks/favorites-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Avent Properties - Luxury Real Estate in Uruguay",
  description:
    "Premium coastal properties in Uruguay for Dubai investors. Discover luxury real estate in Punta del Este, José Ignacio, and Piriápolis.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans">
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
        <PerformanceMonitor />
      </body>
    </html>
  )
}
