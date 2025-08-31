"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useCallback } from "react"

// Types
export interface InputFieldState {
    value: string
    error: string | null
    isFocused: boolean
    isTouched: boolean
    isValid: boolean
}

export interface InputFieldProps {
    label: string
    type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search'
    placeholder?: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    onFocus?: () => void
    error?: string
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    className?: string
    icon?: React.ReactNode
    validation?: {
        minLength?: number
        maxLength?: number
        pattern?: RegExp
        custom?: (value: string) => string | null
    }
    showValidation?: boolean
    autoComplete?: string
    autoFocus?: boolean
    id?: string
    name?: string
}

// Utility function for event handler composition
function callAll<T extends (...args: any[]) => any>(...fns: (T | undefined)[]): T {
    return ((...args: any[]) => {
        fns.forEach(fn => {
            if (fn) {
                fn(...args)
            }
        })
    }) as T
}

// Prop Collections and Getters Hook
export function useInputField({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    required = false,
    disabled = false,
    readOnly = false,
    validation,
    showValidation = true,
    autoComplete,
    autoFocus = false,
    id,
    name,
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isTouched, setIsTouched] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    // Validation logic
    const validateValue = useCallback((val: string): string | null => {
        if (!validation) return null

        // Custom validation takes priority
        if (validation.custom) {
            const customError = validation.custom(val)
            if (customError) return customError
        }

        // Then check built-in validations
        if (validation.minLength && val.length < validation.minLength) {
            return `Minimum ${validation.minLength} characters required`
        }

        if (validation.maxLength && val.length > validation.maxLength) {
            return `Maximum ${validation.maxLength} characters allowed`
        }

        if (validation.pattern && !validation.pattern.test(val)) {
            return 'Invalid format'
        }

        return null
    }, [validation])

    // Auto-validate if validation rules are provided and field is touched
    const validationError = isTouched && validation ? validateValue(value) : null
    const hasError = Boolean(error || validationError)
    const isValid = !hasError && value.length > 0 && isTouched

    // Event handlers
    const handleFocus = useCallback(() => {
        setIsFocused(true)
        onFocus?.()
    }, [onFocus])

    const handleBlur = useCallback(() => {
        setIsFocused(false)
        setIsTouched(true)
        onBlur?.()
    }, [onBlur])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)
    }, [onChange])

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    // Prop Collections (pre-configured prop objects)
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`
    const inputProps = {
        type: inputType,
        placeholder,
        value,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        disabled,
        readOnly,
        autoComplete,
        autoFocus,
        id: inputId,
        name,
        'aria-invalid': hasError,
        'aria-describedby': hasError ? `${inputId}-error` : undefined,
        'aria-required': required,
    }

    const labelProps = {
        htmlFor: inputId,
        className: cn(
            "text-foreground font-medium",
            hasError && "text-red-500",
            isValid && "text-green-600"
        ),
    }

    const containerProps = {
        className: cn(
            "space-y-2",
            hasError && "text-red-500",
            isValid && "text-green-600"
        ),
    }

    // Prop Getters (functions for composition)
    const getInputProps = useCallback(({ className, onChange: customOnChange, onFocus: customOnFocus, onBlur: customOnBlur, ...props } = {}) => ({
        ...inputProps,
        onChange: customOnChange ? callAll(handleChange, customOnChange) : handleChange,
        onFocus: customOnFocus ? callAll(handleFocus, customOnFocus) : handleFocus,
        onBlur: customOnBlur ? callAll(handleBlur, customOnBlur) : handleBlur,
        className: cn(
            "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive glass bg-white/5 text-foreground placeholder:text-muted-foreground focus:ring-gold/20",
            hasError && "border-red-500/50 focus:border-red-500",
            isValid && "border-green-500/50 focus:border-green-500",
            isFocused && "ring-2 ring-gold/20",
            className
        ),
        ...props,
    }), [inputProps, hasError, isValid, isFocused, handleChange, handleFocus, handleBlur])

    const getLabelProps = useCallback(({ className, ...props } = {}) => ({
        ...labelProps,
        className: cn(labelProps.className, className),
        ...props,
    }), [labelProps])

    const getContainerProps = useCallback(({ className, ...props } = {}) => ({
        ...containerProps,
        className: cn(containerProps.className, className),
        ...props,
    }), [containerProps])

    const getToggleButtonProps = useCallback(({ onClick, ...props } = {}) => ({
        type: 'button' as const,
        variant: 'ghost' as const,
        size: 'sm' as const,
        onClick: callAll(onClick, togglePasswordVisibility),
        'aria-label': showPassword ? 'Hide password' : 'Show password',
        className: "absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground",
        ...props,
    }), [togglePasswordVisibility, showPassword])

    const getValidationIconProps = useCallback(({ className, ...props } = {}) => ({
        className: cn(
            "absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4",
            hasError && "text-red-500",
            isValid && "text-green-500",
            className
        ),
        ...props,
    }), [hasError, isValid])

    const getErrorProps = useCallback(({ className, ...props } = {}) => ({
        id: `${inputId}-error`,
        role: 'alert',
        className: cn("text-red-500 text-sm mt-1", className),
        ...props,
    }), [inputId])

    const getSuccessProps = useCallback(({ className, ...props } = {}) => ({
        className: cn("text-green-600 text-sm mt-1", className),
        ...props,
    }), [])

    // State and computed values
    const state: InputFieldState = {
        value,
        error: error || validationError,
        isFocused,
        isTouched,
        isValid,
    }

    return {
        // State
        state,

        // Computed values
        hasError,
        isValid,
        isPassword,
        showPassword,

        // Actions
        togglePasswordVisibility,
        validateValue,

        // Prop Collections (static objects)
        inputProps,
        labelProps,
        containerProps,

        // Prop Getters (functions for composition)
        getInputProps,
        getLabelProps,
        getContainerProps,
        getToggleButtonProps,
        getValidationIconProps,
        getErrorProps,
        getSuccessProps,
    }
}

// Advanced InputField Component using Prop Collections and Getters
export function InputFieldAdvanced(props: InputFieldProps) {
    const {
        label,
        icon,
        className,
        showValidation = true,
    } = props

    const {
        state,
        hasError,
        isValid,
        isPassword,
        showPassword,
        getInputProps,
        getLabelProps,
        getContainerProps,
        getToggleButtonProps,
        getValidationIconProps,
        getErrorProps,
        getSuccessProps,
    } = useInputField(props)

    return (
        <div {...getContainerProps({ className })}>
            <Label {...getLabelProps()}>
                {label}
                {props.required && <span className="text-gold ml-1">*</span>}
            </Label>

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}

                <Input {...getInputProps()} />

                {showValidation && (
                    <>
                        {isPassword && (
                            <Button {...getToggleButtonProps()}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        )}

                        {hasError && (
                            <AlertCircle {...getValidationIconProps()} />
                        )}

                        {isValid && !isPassword && (
                            <CheckCircle {...getValidationIconProps()} />
                        )}
                    </>
                )}
            </div>

            {showValidation && hasError && (
                <p {...getErrorProps()}>
                    {state.error}
                </p>
            )}

            {showValidation && isValid && !isPassword && (
                <p {...getSuccessProps()}>
                    Looks good!
                </p>
            )}
        </div>
    )
}

// Specialized input components using the hook
export function EmailInput(props: Omit<InputFieldProps, 'type' | 'validation'>) {
    const emailValidation = {
        custom: (value: string) => {
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Please enter a valid email address'
            }
            return null
        }
    }

    return (
        <InputFieldAdvanced
            {...props}
            type="email"
            validation={emailValidation}
            autoComplete="email"
        />
    )
}

export function PasswordInput(props: Omit<InputFieldProps, 'type' | 'validation'>) {
    const passwordValidation = {
        custom: (value: string) => {
            if (value && value.length < 8) {
                return 'Password must be at least 8 characters long'
            }
            if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                return 'Password must contain uppercase, lowercase, and number'
            }
            return null
        }
    }

    return (
        <InputFieldAdvanced
            {...props}
            type="password"
            validation={passwordValidation}
            autoComplete="new-password"
        />
    )
}

export function PhoneInput(props: Omit<InputFieldProps, 'type' | 'validation'>) {
    const phoneValidation = {
        custom: (value: string) => {
            if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
                return 'Please enter a valid phone number'
            }
            if (value && value.replace(/\D/g, '').length < 10) {
                return 'Phone number must be at least 10 digits'
            }
            return null
        }
    }

    return (
        <InputFieldAdvanced
            {...props}
            type="tel"
            validation={phoneValidation}
            autoComplete="tel"
        />
    )
}

// Export the hook for custom implementations
export { useInputField }
