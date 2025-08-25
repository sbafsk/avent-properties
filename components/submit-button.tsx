"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubmitButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: "default" | "outline"
  onClick?: () => void
  type?: "button" | "submit"
}

export function SubmitButton({
  children,
  loading = false,
  disabled = false,
  className,
  variant = "default",
  onClick,
  type = "submit",
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      className={cn(
        "w-full py-6 text-lg font-medium transition-all duration-200",
        variant === "default"
          ? "bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg hover:shadow-gold/20"
          : "glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent",
        loading && "cursor-not-allowed",
        className,
      )}
    >
      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </Button>
  )
}
