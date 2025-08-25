"use client"

import { AuthForm } from "@/components/auth-form"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth"
import { useState } from "react"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (data: {
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
      setError(null)
      
      // Sign up with Supabase Auth
      const result = await signUp(data)

      console.log("Sign up successful:", result)
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Sign up error:", error)
      setError(error instanceof Error ? error.message : "Sign up failed")
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <AuthForm mode="signup" onSubmit={handleSignUp} />
    </div>
  )
}
