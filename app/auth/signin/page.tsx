"use client"

import { AuthForm } from "@/components/auth-form"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Sign in data:", data)

    // In a real app, you would handle authentication here
    // For now, just redirect to dashboard
    router.push("/dashboard")
  }

  return <AuthForm mode="signin" onSubmit={handleSignIn} />
}
