"use client"

import { AuthForm } from "@/components/auth-form"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  const handleSignUp = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Sign up data:", data)

    // In a real app, you would handle user registration here
    // For now, just redirect to dashboard
    router.push("/dashboard")
  }

  return <AuthForm mode="signup" onSubmit={handleSignUp} />
}
