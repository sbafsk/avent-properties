import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "nav" | "subtle"
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  const variants = {
    default: "glass-card",
    nav: "glass-nav",
    subtle: "glass",
  }

  return <div className={cn(variants[variant], className)}>{children}</div>
}
