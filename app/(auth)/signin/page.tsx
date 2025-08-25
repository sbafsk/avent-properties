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
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-4xl mx-auto">
        {showDemoCredentials ? (
          <DemoCredentials onSelectCredentials={handleDemoCredentialsSelect} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
            {/* Sign In Form */}
            <div className="w-full lg:w-1/2">
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
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
              {/* Direct Credentials Display */}
              <div className="space-y-4">
                {/* Admin Credentials */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-red-300 text-sm">👑</span>
                    <h3 className="heading-luxury text-sm text-foreground">Admin</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-luxury text-xs text-muted-foreground w-12">Email:</span>
                      <code className="flex-1 p-1 bg-white/5 rounded border border-white/10 text-xs font-mono">
                        admin@aventproperties.com
                      </code>
                      <button
                        onClick={() => copyToClipboard('admin@aventproperties.com', 'admin-email')}
                        className="p-1 text-xs hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedField === 'admin-email' ? '✓' : '📋'}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-luxury text-xs text-muted-foreground w-12">Pass:</span>
                      <code className="flex-1 p-1 bg-white/5 rounded border border-white/10 text-xs font-mono">
                        admin123456
                      </code>
                      <button
                        onClick={() => copyToClipboard('admin123456', 'admin-password')}
                        className="p-1 text-xs hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedField === 'admin-password' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Client Credentials */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-300 text-sm">👤</span>
                    <h3 className="heading-luxury text-sm text-foreground">Client</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-luxury text-xs text-muted-foreground w-12">Email:</span>
                      <code className="flex-1 p-1 bg-white/5 rounded border border-white/10 text-xs font-mono">
                        client@example.com
                      </code>
                      <button
                        onClick={() => copyToClipboard('client@example.com', 'client-email')}
                        className="p-1 text-xs hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedField === 'client-email' ? '✓' : '📋'}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-luxury text-xs text-muted-foreground w-12">Pass:</span>
                      <code className="flex-1 p-1 bg-white/5 rounded border border-white/10 text-xs font-mono">
                        client123456
                      </code>
                      <button
                        onClick={() => copyToClipboard('client123456', 'client-password')}
                        className="p-1 text-xs hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedField === 'client-password' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agency Credentials */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-300 text-sm">🏢</span>
                    <h3 className="heading-luxury text-sm text-foreground">Agency</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-luxury text-xs text-muted-foreground w-12">Email:</span>
                      <code className="flex-1 p-1 bg-white/5 rounded border border-white/10 text-xs font-mono">
                        agency@luxuryestates.uy
                      </code>
                      <button
                        onClick={() => copyToClipboard('agency@luxuryestates.uy', 'agency-email')}
                        className="p-1 text-xs hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedField === 'agency-email' ? '✓' : '📋'}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-luxury text-xs text-muted-foreground w-12">Pass:</span>
                      <code className="flex-1 p-1 bg-white/5 rounded border border-white/10 text-xs font-mono">
                        agency123456
                      </code>
                      <button
                        onClick={() => copyToClipboard('agency123456', 'agency-password')}
                        className="p-1 text-xs hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedField === 'agency-password' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
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
