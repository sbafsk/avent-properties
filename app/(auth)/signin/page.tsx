"use client"

import { AuthForm } from "@/components/auth-form"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth"
import { useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

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



  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      

      
      <AuthForm mode="signin" onSubmit={handleSignIn} />
    </div>
  )
}
