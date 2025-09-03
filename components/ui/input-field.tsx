import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InputFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  required?: boolean
  placeholder?: string
  error?: string
  description?: string
  disabled?: boolean
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function InputField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  error,
  description,
  disabled = false,
  className,
  value,
  onChange
}: InputFieldProps) {
  const id = `input-${name}`
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "transition-colors",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-describedby={cn(
          error && `${id}-error`,
          description && `${id}-description`
        )}
        aria-invalid={!!error}
        aria-required={required}
      />
      
      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
