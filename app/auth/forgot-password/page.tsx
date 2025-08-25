"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/glass-card"
import { InputField } from "@/components/input-field"
import { SubmitButton } from "@/components/submit-button"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
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
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                <span className="text-gold-foreground font-bold text-xl">A</span>
              </div>
              <span className="heading-luxury text-2xl text-foreground">Avent Properties</span>
            </Link>

            {!sent ? (
              <>
                <h1 className="heading-luxury text-3xl text-foreground mb-2">Reset Password</h1>
                <p className="text-luxury text-muted-foreground">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gold" />
                </div>
                <h1 className="heading-luxury text-3xl text-foreground mb-2">Check Your Email</h1>
                <p className="text-luxury text-muted-foreground">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
              </>
            )}
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Email Address"
                type="email"
                placeholder="ahmed@example.com"
                value={email}
                onChange={setEmail}
                error={error}
                required
                icon={<Mail className="h-4 w-4" />}
              />

              <SubmitButton loading={loading}>Send Reset Link</SubmitButton>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 glass rounded-lg border border-gold/20">
                <p className="text-luxury text-sm text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSent(false)
                      setEmail("")
                    }}
                    className="text-gold hover:text-gold/80"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Back to Sign In */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-luxury text-sm text-gold hover:text-gold/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
