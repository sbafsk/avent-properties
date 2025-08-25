"use client"

import { AuthForm } from "@/components/auth-form"
import { DemoCredentials } from "@/components/ui/demo-credentials"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth"
import { useState, Suspense } from "react"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)
  const [selectedCredentials, setSelectedCredentials] = useState<{
    email: string
    password: string
  } | undefined>(undefined)

  const handleSignIn = async (data: {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    phone: string
    location: string
    company: string
  }) => {
    try {
      console.log("Sign in attempt with:", { email: data.email })
      setError(null)
      
      const result = await signIn({
        email: data.email,
        password: data.password,
      })

      console.log("Sign in successful:", result)

      // Redirect to dashboard or the original intended page
      const redirectTo = searchParams.get('redirectTo') || '/overview'
      console.log("Redirecting to:", redirectTo)
      router.push(redirectTo)
    } catch (err) {
      console.error("Sign in error:", err)
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
    }
  }

  const handleDemoCredentialsSelect = (email: string, password: string) => {
    setSelectedCredentials({ email, password })
    setShowDemoCredentials(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=auth-bg')] bg-cover bg-center opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {showDemoCredentials ? (
          <DemoCredentials onSelectCredentials={handleDemoCredentialsSelect} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Sign In Form */}
            <div className="w-full lg:w-1/2">
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <AuthForm 
                mode="signin" 
                onSubmit={handleSignIn} 
                demoCredentials={selectedCredentials}
              />
            </div>

            {/* Demo Credentials Section */}
            <div className="w-full lg:w-1/2">
              <div className="text-center mb-8">
                <h2 className="heading-luxury text-3xl text-foreground mb-4">
                  Try Our Demo
                </h2>
                <p className="text-luxury text-muted-foreground mb-6">
                  Experience the platform with different user roles and see the full range of features available.
                </p>
                <button
                  onClick={() => setShowDemoCredentials(true)}
                  className="bg-gold text-gold-foreground px-8 py-3 rounded-lg hover:bg-gold/90 transition-colors font-semibold"
                >
                  View Demo Credentials
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <h3 className="heading-luxury text-lg text-foreground mb-2">👑 Admin Access</h3>
                  <p className="text-luxury text-sm text-muted-foreground">
                    Full system control, user management, and analytics dashboard
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <h3 className="heading-luxury text-lg text-foreground mb-2">🏠 Client Experience</h3>
                  <p className="text-luxury text-sm text-muted-foreground">
                    Browse properties, make reservations, and manage your portfolio
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <h3 className="heading-luxury text-lg text-foreground mb-2">🏢 Agency Tools</h3>
                  <p className="text-luxury text-sm text-muted-foreground">
                    Property management, client communication, and transaction tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
