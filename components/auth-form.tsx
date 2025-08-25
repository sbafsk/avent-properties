"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlassCard } from "./glass-card"
import { InputField } from "./input-field"
import { SubmitButton } from "./submit-button"
import { Button } from "@/components/ui/button"
import { Mail, Lock, User, Phone, MapPin, Building } from "lucide-react"

interface AuthFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  location: string
  company: string
}

interface AuthFormProps {
  mode: "signin" | "signup"
  onSubmit: (data: AuthFormData) => Promise<void>
  demoCredentials?: {
    email: string
    password: string
  }
}

export function AuthForm({ mode, onSubmit, demoCredentials }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    company: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isSignUp = mode === "signup"

  // Auto-fill form when demo credentials are provided
  useEffect(() => {
    if (demoCredentials) {
      setFormData(prev => ({
        ...prev,
        email: demoCredentials.email,
        password: demoCredentials.password
      }))
    }
  }, [demoCredentials])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (isSignUp) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      }
      if (!formData.location) {
        newErrors.location = "Location is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData)

    if (!validateForm()) {
      console.log("Form validation failed")
      return
    }

    console.log("Form validation passed, calling onSubmit")
    setLoading(true)
    try {
      await onSubmit(formData)
      console.log("onSubmit completed successfully")
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=auth-bg')] bg-cover bg-center opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                <span className="text-gold-foreground font-bold text-xl">A</span>
              </div>
              <span className="heading-luxury text-2xl text-foreground">Avent Properties</span>
            </Link>

            <h1 className="heading-luxury text-3xl text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-luxury text-muted-foreground">
              {isSignUp
                ? "Join our exclusive community of luxury property investors"
                : "Sign in to access your luxury property portfolio"}
            </p>
          </div>

          {/* Demo Credentials Notice */}
          {demoCredentials && (
            <div className="mb-6 p-3 bg-gold/10 border border-gold/20 rounded-lg">
              <p className="text-luxury text-sm text-gold">
                🎯 Demo credentials loaded! Ready to explore the platform.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  placeholder="Ahmed"
                  value={formData.firstName}
                  onChange={(value) => updateField("firstName", value)}
                  error={errors.firstName}
                  required
                  icon={<User className="h-4 w-4" />}
                />
                <InputField
                  label="Last Name"
                  placeholder="Al-Rashid"
                  value={formData.lastName}
                  onChange={(value) => updateField("lastName", value)}
                  error={errors.lastName}
                  required
                  icon={<User className="h-4 w-4" />}
                />
              </div>
            )}

            <InputField
              label="Email Address"
              type="email"
              placeholder="ahmed@example.com"
              value={formData.email}
              onChange={(value) => updateField("email", value)}
              error={errors.email}
              required
              icon={<Mail className="h-4 w-4" />}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => updateField("password", value)}
              error={errors.password}
              required
              icon={<Lock className="h-4 w-4" />}
            />

            {isSignUp && (
              <>
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(value) => updateField("confirmPassword", value)}
                  error={errors.confirmPassword}
                  required
                  icon={<Lock className="h-4 w-4" />}
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(value) => updateField("phone", value)}
                  error={errors.phone}
                  required
                  icon={<Phone className="h-4 w-4" />}
                />

                <InputField
                  label="Location"
                  placeholder="Dubai, UAE"
                  value={formData.location}
                  onChange={(value) => updateField("location", value)}
                  error={errors.location}
                  required
                  icon={<MapPin className="h-4 w-4" />}
                />

                <InputField
                  label="Company (Optional)"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={(value) => updateField("company", value)}
                  icon={<Building className="h-4 w-4" />}
                />
              </>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-gold" />
                  <span className="text-luxury text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-luxury text-sm text-gold hover:text-gold/80">
                  Forgot password?
                </Link>
              </div>
            )}

            <SubmitButton loading={loading}>{isSignUp ? "Create Account" : "Sign In"}</SubmitButton>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-luxury text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                href={isSignUp ? "/auth/signin" : "/auth/signup"}
                className="text-gold hover:text-gold/80 font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>

          {/* Terms */}
          {isSignUp && (
            <div className="mt-6 text-center">
              <p className="text-luxury text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-gold hover:text-gold/80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gold hover:text-gold/80">
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </GlassCard>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-luxury text-sm text-muted-foreground">
            Secure authentication powered by industry-leading encryption
          </p>
        </div>
      </div>
    </div>
  )
}
