"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface InputFieldProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  className?: string
  icon?: React.ReactNode
}

export function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className,
  icon,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-foreground font-medium">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "glass border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground",
            "focus:border-gold focus:ring-gold/20",
            icon && "pl-10",
            isPassword && "pr-10",
            error && "border-red-500/50 focus:border-red-500",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
